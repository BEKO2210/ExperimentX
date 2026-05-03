import type { Preregistration, ReplicationConfig, StateProtocol } from '../domain/experiment';

export function SessionSetup({
  prereg,
  stateProtocol,
  replication,
  participantCode,
  onParticipantCodeChange,
  onReplicationChange,
  onPreregChange,
  onStateChange,
  onStart
}: {
  prereg: Preregistration;
  stateProtocol: StateProtocol;
  replication: ReplicationConfig;
  participantCode: string;
  onParticipantCodeChange: (next: string) => void;
  onReplicationChange: (next: ReplicationConfig) => void;
  onPreregChange: (next: Preregistration) => void;
  onStateChange: (next: StateProtocol) => void;
  onStart: () => void;
}) {
  return (
    <section>
      <h3>Preregistration (Run 005)</h3>
      <label>Participant code <input value={participantCode} onChange={(e) => onParticipantCodeChange(e.target.value)} placeholder="P001" /></label>
      <label>Planned trials <input type="number" min={1} max={200} value={prereg.plannedTrials} onChange={(e) => onPreregChange({ ...prereg, plannedTrials: Number(e.target.value) })} /></label>
      <label>Candidates per trial <input type="number" min={2} max={8} value={prereg.candidatesPerTrial} onChange={(e) => onPreregChange({ ...prereg, candidatesPerTrial: Number(e.target.value) })} /></label>
      <label>Hypothesis <textarea value={prereg.hypothesis} onChange={(e) => onPreregChange({ ...prereg, hypothesis: e.target.value })} /></label>
      <label>Exclusion rules <textarea value={prereg.exclusionRules} onChange={(e) => onPreregChange({ ...prereg, exclusionRules: e.target.value })} /></label>

      <h3>Replication Mode (Run 016)</h3>
      <label><input type="checkbox" checked={replication.enabled} onChange={(e) => onReplicationChange({ ...replication, enabled: e.target.checked })} /> Enable replication mode</label>
      <label>Cohort label <input value={replication.cohortLabel ?? ''} onChange={(e) => onReplicationChange({ ...replication, cohortLabel: e.target.value })} placeholder="pilot-cohort-a" /></label>

      <h3>State Protocol (Run 011)</h3>
      <label>Mood: {stateProtocol.mood}<input type="range" min={0} max={100} value={stateProtocol.mood} onChange={(e) => onStateChange({ ...stateProtocol, mood: Number(e.target.value) })} /></label>
      <label>Stress: {stateProtocol.stress}<input type="range" min={0} max={100} value={stateProtocol.stress} onChange={(e) => onStateChange({ ...stateProtocol, stress: Number(e.target.value) })} /></label>
      <label>Fatigue: {stateProtocol.fatigue}<input type="range" min={0} max={100} value={stateProtocol.fatigue} onChange={(e) => onStateChange({ ...stateProtocol, fatigue: Number(e.target.value) })} /></label>
      <label>Preparation minutes <input type="number" min={0} max={240} value={stateProtocol.preparationMinutes} onChange={(e) => onStateChange({ ...stateProtocol, preparationMinutes: Number(e.target.value) })} /></label>
      <label>State notes <textarea value={stateProtocol.notes ?? ''} onChange={(e) => onStateChange({ ...stateProtocol, notes: e.target.value })} /></label>
      <button onClick={onStart} disabled={prereg.hypothesis.trim().length < 10 || prereg.exclusionRules.trim().length < 10 || participantCode.trim().length < 2}>Start Demo Session</button>
    </section>
  );
}
