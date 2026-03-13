// Event Model - Represents a calendar event (can be a session or other event)

export type EventType = 'session' | 'other';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;              // YYYY-MM-DD format
  time: string;              // HH:MM format
  duration: number;          // in minutes
  type: EventType;
  sessionId?: string;        // Reference to a Session if event is a training session
  color: string;
  hasConflict: boolean;
}

export interface DayEvent {
  date: string;
  events: CalendarEvent[];
  hasConflict: boolean;
}

export interface WeekView {
  startDate: string;
  endDate: string;
  days: DayEvent[];
}
