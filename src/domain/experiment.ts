export type TargetId = string;

export interface TargetImage {
  id: TargetId;
  title: string;
  description?: string;
  imageUrl: string;
  category?: string;
}

export interface TrialCandidate {
  targetId: TargetId;
  displayOrder: number;
}

export interface Preregistration {
  plannedTrials: number;
  candidatesPerTrial: number;
  hypothesis: string;
  exclusionRules: string;
  registeredAt: string;
}

export interface StateProtocol {
  mood: number; // 0-100
  stress: number; // 0-100
  fatigue: number; // 0-100
  preparationMinutes: number;
  notes?: string;
  recordedAt: string;
}


export interface ReplicationConfig {
  enabled: boolean;
  protocolId?: string;
  cohortLabel?: string;
}

export interface Trial {
  id: string;
  createdAt: string;
  candidateIds: TargetId[];
  actualTargetId: TargetId;
  impressionText?: string;
  ranking?: TargetId[];
  confidence?: number;
  completedAt?: string;
}

import type { AuditEvent } from './audit';
import type { SessionIntegrityRecord } from './integrity';

export interface Session {
  id: string;
  createdAt: string;
  participantCode?: string;
  protocolVersion: string;
  candidatesPerTrial: number;
  trials: Trial[];
  preregistration?: Preregistration;
  stateProtocol?: StateProtocol;
  auditLog?: AuditEvent[];
  notes?: string;
  replication?: ReplicationConfig;
  integrity?: SessionIntegrityRecord;
}

export interface TrialResult {
  trialId: string;
  hit: boolean;
  actualRank?: number;
}

export interface SessionResult {
  totalTrials: number;
  hits: number;
  hitRate: number;
  expectedChanceRate: number;
  results: TrialResult[];
}
