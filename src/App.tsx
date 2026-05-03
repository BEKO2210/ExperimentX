import { useEffect, useMemo, useState, type ChangeEventHandler } from 'react';
import { Layout } from './components/Layout';
import { ProtocolView } from './components/ProtocolView';
import { ResultsPanel } from './components/ResultsPanel';
import { SessionSetup } from './components/SessionSetup';
import { TargetRanking } from './components/TargetRanking';
import { BiasPanel } from './components/BiasPanel';
import { demoTargets } from './data/demoTargets';
import type { TargetImage } from './domain/experiment';
import type { Preregistration, ReplicationConfig, Session, StateProtocol, Trial } from './domain/experiment';
import { pickCandidates, pickOne, shuffle } from './domain/randomization';
import { clearSession, loadSession, saveSession } from './domain/sessionStore';
import { exportSession, importSession } from './domain/sessionIO';
import { aggregateSessions, binomialProbabilityAtLeast, scoreSession, summarizeConfidence } from './domain/statistics';
import { exportTargetPool, importTargetPool } from './domain/targetPoolIO';
import { appendAuditEvent } from './domain/audit';
import { appendSessionHistory, clearSessionHistory, loadSessionHistory } from './domain/sessionHistory';
import { countReplications, createReplicationProtocolId } from './domain/replication';
import { createIntegrityRecord, verifyIntegrityRecord, type SessionIntegrityRecord } from './domain/integrity';
import { generateSkepticalReview } from './domain/skepticalReview';
import { SkepticalReviewPanel } from './components/SkepticalReviewPanel';

type TrialPhase = 'impression' | 'ranking';

function makeSession(preregistration: Preregistration, stateProtocol: StateProtocol, participantCode: string, replication: ReplicationConfig, pool: TargetImage[]): Session {
  const trials: Trial[] = Array.from({ length: preregistration.plannedTrials }, (_, idx) => {
    const candidateIds = pickCandidates(pool.map((t) => t.id), preregistration.candidatesPerTrial);
    return {
      id: `trial-${idx + 1}`,
      createdAt: new Date().toISOString(),
      candidateIds,
      actualTargetId: pickOne(candidateIds)
    };
  });
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    protocolVersion: '0.5.0',
    candidatesPerTrial: preregistration.candidatesPerTrial,
    preregistration,
    stateProtocol,
    trials,
    participantCode: participantCode.trim(),
    replication
  };
}

const defaultPrereg = (): Preregistration => ({
  plannedTrials: 10,
  candidatesPerTrial: 4,
  hypothesis: 'Exploratory: participants may rank targets above chance under controlled conditions.',
  exclusionRules: 'Exclude trials with incomplete ranking or protocol deviations.',
  registeredAt: new Date().toISOString()
});

const defaultStateProtocol = (): StateProtocol => ({
  mood: 50,
  stress: 50,
  fatigue: 50,
  preparationMinutes: 5,
  notes: '',
  recordedAt: new Date().toISOString()
});

export default function App() {
  const [session, setSession] = useState<Session | null>(() => loadSession());
  const [trialIndex, setTrialIndex] = useState(0);
  const [phase, setPhase] = useState<TrialPhase>('impression');
  const [impression, setImpression] = useState('');
  const [ranking, setRanking] = useState<string[]>([]);
  const [confidence, setConfidence] = useState(50);
  const [prereg, setPrereg] = useState<Preregistration>(defaultPrereg());
  const [doubleBlindMode] = useState(true);
  const [displayOrderByTrial, setDisplayOrderByTrial] = useState<Record<string, string[]>>({});
  const [targetPool, setTargetPool] = useState<TargetImage[]>(demoTargets);
  const [stateProtocol, setStateProtocol] = useState<StateProtocol>(defaultStateProtocol());
  const [participantCode, setParticipantCode] = useState('');
  const [replication, setReplication] = useState<ReplicationConfig>({ enabled: false, cohortLabel: '' });
  const [sessionHistory, setSessionHistory] = useState<Session[]>([]);
  const [integrityRecord, setIntegrityRecord] = useState<SessionIntegrityRecord | null>(null);
  const [integrityValid, setIntegrityValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (session) saveSession(session);
  }, [session]);

  useEffect(() => {
    setSessionHistory(loadSessionHistory());
  }, []);

  const activeTrial = session?.trials[trialIndex] ?? null;

  useEffect(() => {
    if (!session || activeTrial) return;
    createIntegrityRecord(session).then((record) => {
      setIntegrityRecord(record);
      return verifyIntegrityRecord(record);
    }).then((ok) => setIntegrityValid(ok));
  }, [session, activeTrial]);
  const candidateTargets = useMemo(() => {
    if (!activeTrial) return [];
    const ids = displayOrderByTrial[activeTrial.id] ?? activeTrial.candidateIds;
    return ids.map((id) => targetPool.find((t) => t.id === id)).filter((x): x is NonNullable<typeof x> => Boolean(x));
  }, [activeTrial, displayOrderByTrial, targetPool]);

  const downloadSession = () => {
    if (!session) return;
    const blob = new Blob([exportSession(session)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `experimentx-session-${session.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onImportSession: ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    file.text().then((txt) => {
      try {
        const imported = importSession(txt);
        setSession(appendAuditEvent(imported, 'session_imported'));
        const firstOpen = imported.trials.findIndex((t) => !t.completedAt);
        setTrialIndex(firstOpen === -1 ? imported.trials.length : firstOpen);
        setPhase('impression');
        setImpression('');
        setRanking([]);
        setConfidence(50);
        setDisplayOrderByTrial(Object.fromEntries(imported.trials.map((tr) => [tr.id, shuffle(tr.candidateIds)])));
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Import failed');
      }
    });
    event.currentTarget.value = '';
  };


  const onImportTargetPool: ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    file.text().then((txt) => {
      try {
        const imported = importTargetPool(txt);
        setTargetPool(imported);
        if (session) setSession(appendAuditEvent(session, 'target_pool_imported', { poolSize: imported.length }));
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Target pool import failed');
      }
    });
    event.currentTarget.value = '';
  };

  const downloadTargetPool = () => {
    const blob = new Blob([exportTargetPool(targetPool)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'experimentx-target-pool.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const startSession = () => {
    const preregNow = { ...prereg, registeredAt: new Date().toISOString() };
    const stateNow = { ...stateProtocol, recordedAt: new Date().toISOString() };
    const replicationNow: ReplicationConfig = replication.enabled ? { ...replication, protocolId: `manual-${Date.now()}` } : replication;
    let newSession = makeSession(preregNow, stateNow, participantCode, replicationNow, targetPool);
    if (replicationNow.enabled) {
      newSession.replication = { ...replicationNow, protocolId: createReplicationProtocolId(newSession) };
    }
    newSession = appendAuditEvent(newSession, 'session_started', { plannedTrials: preregNow.plannedTrials, candidatesPerTrial: preregNow.candidatesPerTrial, mood: stateNow.mood, stress: stateNow.stress, fatigue: stateNow.fatigue });
    setSession(newSession);
    setTrialIndex(0);
    setPhase('impression');
    setImpression('');
    setRanking([]);
    setConfidence(50);
    setDisplayOrderByTrial({});
    setIntegrityRecord(null);
    setIntegrityValid(null);
  };

  if (!session) {
    return <Layout><h1>ExperimentX</h1><h2>Controlled target-identification experiments</h2><p>ExperimentX tests whether participants can rank hidden target images above chance under controlled conditions. It does not claim to prove paranormal phenomena or non-local consciousness.</p><SessionSetup prereg={prereg} stateProtocol={stateProtocol} replication={replication} participantCode={participantCode} onParticipantCodeChange={setParticipantCode} onReplicationChange={setReplication} onPreregChange={setPrereg} onStateChange={setStateProtocol} onStart={startSession} /><label>Import Session JSON <input type="file" accept="application/json" onChange={onImportSession} /></label><label>Import Target Pool JSON <input type="file" accept="application/json" onChange={onImportTargetPool} /></label><button onClick={downloadTargetPool}>Export Target Pool JSON</button><p>Current target pool size: {targetPool.length}</p><ProtocolView /></Layout>;
  }

  if (!activeTrial) {
    const result = scoreSession(session);
    const pValue = binomialProbabilityAtLeast(result.hits, result.totalTrials, result.expectedChanceRate);
    const confidenceSummary = summarizeConfidence(session);
    const merged = aggregateSessions([session, ...sessionHistory]);
    const replicationCount = session.replication?.enabled ? countReplications(session, sessionHistory) : 0;
    const skepticalReview = generateSkepticalReview(session);
    return <Layout><h1>Experiment complete</h1>{session.preregistration && <p>Preregistered plan: {session.preregistration.plannedTrials} trials, {session.preregistration.candidatesPerTrial} candidates per trial.</p>}{session.stateProtocol && <p>State protocol: mood {session.stateProtocol.mood}, stress {session.stateProtocol.stress}, fatigue {session.stateProtocol.fatigue}, prep {session.stateProtocol.preparationMinutes} min.</p>}<ResultsPanel hits={result.hits} total={result.totalTrials} chance={result.expectedChanceRate} pValue={pValue} confidence={confidenceSummary} effectSizeH={merged.effectSizeH} /><h3>Multi-session aggregate (local)</h3><p>Sessions: {merged.sessions}</p><p>Total trials: {merged.totalTrials}</p><p>Total hits: {merged.hits}</p><p>Aggregate hit rate: {(merged.hitRate * 100).toFixed(1)}%</p><p>Aggregate p-value: {merged.pValue.toFixed(4)}</p>{integrityRecord && <p>Integrity hash (SHA-256): {integrityRecord.sessionHash}</p>}{integrityValid !== null && <p>Integrity check: {integrityValid ? 'valid' : 'invalid'}</p>}{session.replication?.enabled && <p>Replication matches in local history: {replicationCount}</p>}{session.replication?.protocolId && <p>Replication protocol ID: {session.replication.protocolId}</p>}<SkepticalReviewPanel review={skepticalReview} /><BiasPanel session={session} /><p>Audit events: {session.auditLog?.length ?? 0}</p><button onClick={() => { appendSessionHistory(session); setSessionHistory(loadSessionHistory()); clearSession(); setSession(null); }}>Back to start</button><button onClick={() => { clearSessionHistory(); setSessionHistory([]); }}>Clear local history</button></Layout>;
  }

  const saveImpression = () => {
    const nextSession = structuredClone(session);
    nextSession.trials[trialIndex].impressionText = impression.trim();
    setSession(appendAuditEvent(nextSession, 'impression_saved', { trialIndex }));
    if (activeTrial && !displayOrderByTrial[activeTrial.id]) {
      setDisplayOrderByTrial((prev) => ({ ...prev, [activeTrial.id]: shuffle(activeTrial.candidateIds) }));
    }
    setPhase('ranking');
  };

  const submitTrial = () => {
    const nextSession = structuredClone(session);
    nextSession.trials[trialIndex].ranking = ranking;
    nextSession.trials[trialIndex].completedAt = new Date().toISOString();
    nextSession.trials[trialIndex].confidence = confidence;
    const trialSession = appendAuditEvent(nextSession, 'ranking_submitted', { trialIndex });
    const finalSession = trialIndex + 1 >= session.trials.length ? appendAuditEvent(trialSession, 'session_completed') : trialSession;
    setSession(finalSession);
    setTrialIndex((v) => v + 1);
    setPhase('impression');
    setImpression('');
    setRanking([]);
    setConfidence(50);
    setDisplayOrderByTrial({});
    setIntegrityRecord(null);
    setIntegrityValid(null);
  };

  return <Layout><h1>Demo Session</h1><p>Trial {trialIndex + 1} / {session.trials.length}</p><button onClick={downloadSession}>Export Session JSON</button>{phase === 'impression' ? <><h3>Step 1: Write impressions</h3>{doubleBlindMode && <p>Double-blind guard: candidate options remain hidden until this step is locked.</p>}<textarea value={impression} onChange={(e) => setImpression(e.target.value)} placeholder="Write impressions before viewing options" /><button onClick={saveImpression} disabled={impression.trim().length < 3}>Continue to ranking</button></> : <><h3>Step 2: Rank candidates (1 to 4)</h3><TargetRanking targets={candidateTargets} value={ranking} onChange={(next) => setRanking(next.slice(0, session.candidatesPerTrial))} /><label>Confidence: {confidence}<input type="range" min={0} max={100} value={confidence} onChange={(e) => setConfidence(Number(e.target.value))} /></label><button onClick={submitTrial} disabled={ranking.length !== session.candidatesPerTrial}>Submit Trial</button></>}</Layout>;
}
