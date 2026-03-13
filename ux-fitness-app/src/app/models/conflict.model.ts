// Conflict Model - Represents a scheduling conflict between events

export type ConflictSeverity = 'minor' | 'major' | 'critical';
export type ResolutionAction = 'move' | 'keep' | 'cancel';

export interface Conflict {
  id: string;
  event1Id: string;
  event2Id: string;
  event1Title: string;
  event2Title: string;
  overlapMinutes: number;
  severity: ConflictSeverity;
  detected: string;           // ISO date string
}

export interface ConflictSuggestion {
  id: string;
  conflictId: string;
  action: ResolutionAction;
  eventId: string;
  eventTitle: string;
  suggestedTime: string;      // HH:MM format
  suggestedDate: string;      // YYYY-MM-DD format
  reason: string;
}

export interface ConflictResolution {
  conflictId: string;
  selectedSuggestionId: string;
  appliedAt: string;          // ISO date string
}
