// Session Model - Represents a training/fitness session

export type SessionType = 'running' | 'cycling' | 'swimming' | 'hiking' | 'other';
export type SessionStatus = 'planned' | 'in-progress' | 'completed' | 'cancelled';
export type SessionIntensity = 'low' | 'moderate' | 'high';

export interface Session {
  id: string;
  userId: string;
  type: SessionType;
  title: string;
  date: string;               // YYYY-MM-DD format
  time: string;               // HH:MM format
  duration: number;           // in minutes
  distance?: number;          // in kilometers
  intensity: SessionIntensity;
  status: SessionStatus;
  location?: string;
  notes?: string;
  caloriesBurned?: number;
}

export interface SessionSummary {
  totalSessions: number;
  totalDistance: number;
  totalDuration: number;
  averagePace: number;
  period: string;
}

export interface UpcomingSession {
  id: string;
  date: string;
  time: string;
  type: SessionType;
  duration: number;
  distance?: number;
}

export interface WeeklyPlan {
  startDate: string;
  endDate: string;
  sessions: Session[];
  totalSessions: number;
  completedSessions: number;
  plannedSessions: number;
}
