// Calendar Service - Manages calendar events and views

import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { CalendarEvent, DayEvent, WeekView } from '../../models';
import { MOCK_CALENDAR_EVENTS } from '../data/mock-data';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  // Signal for calendar events (reactive state)
  private events = signal<CalendarEvent[]>(MOCK_CALENDAR_EVENTS);

  constructor() {}

  /**
   * Get all calendar events
   */
  getAllEvents(): Observable<CalendarEvent[]> {
    return of(this.events()).pipe(delay(300));
  }

  /**
   * Get events for a specific date
   */
  getEventsByDate(date: Date): Observable<CalendarEvent[]> {
    const targetDate = this.normalizeDate(date);
    const filtered = this.events().filter(event => {
      const eventDate = this.normalizeDate(new Date(event.date));
      return eventDate.getTime() === targetDate.getTime();
    });
    return of(filtered).pipe(delay(200));
  }

  /**
   * Get events for a date range
   */
  getEventsByDateRange(startDate: Date, endDate: Date): Observable<CalendarEvent[]> {
    const start = this.normalizeDate(startDate);
    const end = this.normalizeDate(endDate);
    
    const filtered = this.events().filter(event => {
      const eventDate = this.normalizeDate(new Date(event.date));
      return eventDate >= start && eventDate <= end;
    });
    return of(filtered).pipe(delay(300));
  }

  /**
   * Get week view (7 days starting from provided date)
   */
  getWeekView(startDate: Date): Observable<WeekView> {
    const start = this.normalizeDate(startDate);
    const days: DayEvent[] = [];

    // Generate 7 days
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      
      const dayEvents = this.events().filter(event => {
        const eventDate = this.normalizeDate(new Date(event.date));
        return eventDate.getTime() === currentDate.getTime();
      });

      // Check if any event has conflicts
      const hasConflict = dayEvents.some(event => event.hasConflict);

      days.push({
        date: currentDate.toISOString(),
        events: dayEvents,
        hasConflict
      });
    }

    const weekView: WeekView = {
      startDate: start.toISOString(),
      endDate: new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString(),
      days
    };

    return of(weekView).pipe(delay(400));
  }

  /**
   * Create new calendar event
   */
  createEvent(event: Omit<CalendarEvent, 'id'>): Observable<CalendarEvent> {
    const newEvent: CalendarEvent = {
      ...event,
      id: `event-${Date.now()}`
    };
    
    this.events.update(events => [...events, newEvent]);
    return of(newEvent).pipe(delay(400));
  }

  /**
   * Update existing event
   */
  updateEvent(id: string, updates: Partial<CalendarEvent>): Observable<CalendarEvent | null> {
    const index = this.events().findIndex(e => e.id === id);
    
    if (index === -1) {
      return of(null).pipe(delay(200));
    }

    this.events.update(events => {
      const updated = [...events];
      updated[index] = { ...updated[index], ...updates };
      return updated;
    });

    return of(this.events()[index]).pipe(delay(400));
  }

  /**
   * Delete event
   */
  deleteEvent(id: string): Observable<boolean> {
    const index = this.events().findIndex(e => e.id === id);
    
    if (index === -1) {
      return of(false).pipe(delay(200));
    }

    this.events.update(events => events.filter(e => e.id !== id));
    return of(true).pipe(delay(300));
  }

  /**
   * Mark event as having conflict
   */
  markEventConflict(id: string, hasConflict: boolean): Observable<boolean> {
    const index = this.events().findIndex(e => e.id === id);
    
    if (index === -1) {
      return of(false).pipe(delay(200));
    }

    this.events.update(events => {
      const updated = [...events];
      updated[index] = { ...updated[index], hasConflict };
      return updated;
    });

    return of(true).pipe(delay(300));
  }

  /**
   * Get current week view (starting from current Sunday)
   */
  getCurrentWeekView(): Observable<WeekView> {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);
    
    return this.getWeekView(startOfWeek);
  }

  /**
   * Check if a specific date has events
   */
  hasEventsOnDate(date: Date): Observable<boolean> {
    const targetDate = this.normalizeDate(date);
    const hasEvents = this.events().some(event => {
      const eventDate = this.normalizeDate(new Date(event.date));
      return eventDate.getTime() === targetDate.getTime();
    });
    return of(hasEvents).pipe(delay(100));
  }

  /**
   * Normalize date to midnight for comparison
   */
  private normalizeDate(date: Date): Date {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  }

  /**
   * Get events count for current month
   */
  getMonthEventsCount(year: number, month: number): Observable<number> {
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);
    
    const count = this.events().filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= startOfMonth && eventDate <= endOfMonth;
    }).length;

    return of(count).pipe(delay(200));
  }
}
