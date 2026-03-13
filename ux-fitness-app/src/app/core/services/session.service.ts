// Session Service - Manages training sessions

import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Session, SessionSummary, UpcomingSession, WeeklyPlan, SessionStatus } from '../../models';
import { MOCK_SESSIONS } from '../data/mock-data';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  // Signal for sessions (reactive state)
  private sessions = signal<Session[]>(MOCK_SESSIONS);

  constructor() {}

  /**
   * Get all sessions
   */
  getAllSessions(): Observable<Session[]> {
    return of(this.sessions()).pipe(delay(300));
  }

  /**
   * Get session by ID
   */
  getSessionById(id: string): Observable<Session | undefined> {
    const session = this.sessions().find(s => s.id === id);
    return of(session).pipe(delay(200));
  }

  /**
   * Get session by ID (synchronous)
   */
  getSessionByIdSync(id: string): Session | undefined {
    return this.sessions().find(s => s.id === id);
  }

  /**
   * Get sessions for a specific date range
   */
  getSessionsByDateRange(startDate: Date, endDate: Date): Observable<Session[]> {
    const filtered = this.sessions().filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= startDate && sessionDate <= endDate;
    });
    return of(filtered).pipe(delay(300));
  }

  /**
   * Get upcoming sessions (next 7 days)
   */
  getUpcomingSessions(): Observable<UpcomingSession[]> {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const upcoming = this.sessions()
      .filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate >= now && sessionDate <= nextWeek && session.status === 'planned';
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3)
      .map(session => ({
        id: session.id,
        date: session.date,
        time: session.time,
        type: session.type,
        duration: session.duration,
        distance: session.distance
      }));

    return of(upcoming).pipe(delay(200));
  }

  /**
   * Get session summary (last 30 days statistics)
   */
  getSessionSummary(): Observable<SessionSummary> {
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const recentSessions = this.sessions().filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= last30Days && session.status === 'completed';
    });

    const totalSessions = recentSessions.length;
    const totalDistance = recentSessions.reduce((sum, s) => sum + (s.distance || 0), 0);
    const totalDuration = recentSessions.reduce((sum, s) => sum + s.duration, 0);
    const averagePace = totalDistance > 0 ? totalDuration / totalDistance : 0;

    const summary: SessionSummary = {
      totalSessions,
      totalDistance,
      totalDuration,
      averagePace,
      period: 'last30days'
    };

    return of(summary).pipe(delay(200));
  }

  /**
   * Get weekly plan (current week's sessions)
   */
  getWeeklyPlan(): Observable<WeeklyPlan> {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const weekSessions = this.sessions().filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= startOfWeek && sessionDate <= endOfWeek;
    });

    const completed = weekSessions.filter(s => s.status === 'completed').length;
    const planned = weekSessions.filter(s => s.status === 'planned').length;

    const weeklyPlan: WeeklyPlan = {
      startDate: startOfWeek.toISOString(),
      endDate: endOfWeek.toISOString(),
      sessions: weekSessions,
      totalSessions: weekSessions.length,
      completedSessions: completed,
      plannedSessions: planned
    };

    return of(weeklyPlan).pipe(delay(200));
  }

  /**
   * Create new session
   */
  createSession(session: Omit<Session, 'id'>): Observable<Session> {
    const newSession: Session = {
      ...session,
      id: `session-${Date.now()}`
    };
    
    this.sessions.update(sessions => [...sessions, newSession]);
    return of(newSession).pipe(delay(400));
  }

  /**
   * Update existing session
   */
  updateSession(id: string, updates: Partial<Session>): Observable<Session | null> {
    const index = this.sessions().findIndex(s => s.id === id);
    
    if (index === -1) {
      return of(null).pipe(delay(200));
    }

    this.sessions.update(sessions => {
      const updated = [...sessions];
      updated[index] = { ...updated[index], ...updates };
      return updated;
    });

    return of(this.sessions()[index]).pipe(delay(400));
  }

  /**
   * Delete session
   */
  deleteSession(id: string): Observable<boolean> {
    const index = this.sessions().findIndex(s => s.id === id);
    
    if (index === -1) {
      return of(false).pipe(delay(200));
    }

    this.sessions.update(sessions => sessions.filter(s => s.id !== id));
    return of(true).pipe(delay(300));
  }

  /**
   * Update session status
   */
  updateSessionStatus(id: string, status: SessionStatus): Observable<boolean> {
    const index = this.sessions().findIndex(s => s.id === id);
    
    if (index === -1) {
      return of(false).pipe(delay(200));
    }

    this.sessions.update(sessions => {
      const updated = [...sessions];
      updated[index] = { ...updated[index], status };
      return updated;
    });

    return of(true).pipe(delay(300));
  }
}
