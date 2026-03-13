// Conflict Service - Detects and resolves scheduling conflicts

import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Conflict, ConflictSuggestion, ConflictResolution, ConflictSeverity } from '../../models';
import { CalendarEvent } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class ConflictService {

  constructor() {}

  /**
   * Detect conflicts between calendar events
   */
  detectConflicts(events: CalendarEvent[]): Observable<Conflict[]> {
    const conflicts: Conflict[] = [];

    // Sort events by date and time
    const sortedEvents = [...events].sort((a, b) => {
      const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });

    // Check each pair of events on the same day
    for (let i = 0; i < sortedEvents.length; i++) {
      for (let j = i + 1; j < sortedEvents.length; j++) {
        const event1 = sortedEvents[i];
        const event2 = sortedEvents[j];

        // Only check events on the same day
        if (event1.date !== event2.date) continue;

        const overlap = this.calculateOverlap(event1, event2);
        if (overlap > 0) {
          const severity = this.determineSeverity(overlap);
          
          conflicts.push({
            id: `conflict-${event1.id}-${event2.id}`,
            event1Id: event1.id,
            event2Id: event2.id,
            event1Title: event1.title,
            event2Title: event2.title,
            overlapMinutes: overlap,
            severity,
            detected: new Date().toISOString()
          });
        }
      }
    }

    return of(conflicts).pipe(delay(300));
  }

  /**
   * Calculate overlap in minutes between two events
   */
  private calculateOverlap(event1: CalendarEvent, event2: CalendarEvent): number {
    const start1 = this.parseTime(event1.time);
    const end1 = start1 + event1.duration;
    
    const start2 = this.parseTime(event2.time);
    const end2 = start2 + event2.duration;

    // Check if events overlap
    const overlapStart = Math.max(start1, start2);
    const overlapEnd = Math.min(end1, end2);

    return Math.max(0, overlapEnd - overlapStart);
  }

  /**
   * Parse time string (HH:MM) to minutes since midnight
   */
  private parseTime(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }

  /**
   * Format minutes to HH:MM
   */
  private formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  /**
   * Determine conflict severity based on overlap duration
   */
  private determineSeverity(overlapMinutes: number): ConflictSeverity {
    if (overlapMinutes >= 60) return 'critical';
    if (overlapMinutes >= 30) return 'major';
    return 'minor';
  }

  /**
   * Generate suggestions to resolve a conflict
   */
  generateSuggestions(
    conflict: Conflict,
    events: CalendarEvent[]
  ): Observable<ConflictSuggestion[]> {
    const suggestions: ConflictSuggestion[] = [];
    
    const event1 = events.find(e => e.id === conflict.event1Id);
    const event2 = events.find(e => e.id === conflict.event2Id);

    if (!event1 || !event2) {
      return of(suggestions).pipe(delay(200));
    }

    // Suggestion 1: Move event1 earlier
    const event1Start = this.parseTime(event1.time);
    const earlierTime1 = Math.max(0, event1Start - event1.duration - 30); // 30min buffer
    suggestions.push({
      id: `suggestion-1-${conflict.id}`,
      conflictId: conflict.id,
      action: 'move',
      eventId: event1.id,
      eventTitle: event1.title,
      suggestedTime: this.formatTime(earlierTime1),
      suggestedDate: event1.date,
      reason: `Mover "${event1.title}" más temprano para evitar solapamiento`
    });

    // Suggestion 2: Move event2 later
    const event1End = event1Start + event1.duration;
    const laterTime2 = event1End + 30; // 30min buffer
    if (laterTime2 < 1440) { // Check if within same day (24h = 1440min)
      suggestions.push({
        id: `suggestion-2-${conflict.id}`,
        conflictId: conflict.id,
        action: 'move',
        eventId: event2.id,
        eventTitle: event2.title,
        suggestedTime: this.formatTime(laterTime2),
        suggestedDate: event2.date,
        reason: `Mover "${event2.title}" después de "${event1.title}"`
      });
    }

    // Suggestion 3: Move event2 to next day
    const nextDay = new Date(event2.date);
    nextDay.setDate(nextDay.getDate() + 1);
    suggestions.push({
      id: `suggestion-3-${conflict.id}`,
      conflictId: conflict.id,
      action: 'move',
      eventId: event2.id,
      eventTitle: event2.title,
      suggestedTime: event2.time,
      suggestedDate: nextDay.toISOString().split('T')[0],
      reason: `Reprogramar "${event2.title}" para el día siguiente`
    });

    // Suggestion 4: Cancel event with lower priority (event2 by default)
    suggestions.push({
      id: `suggestion-4-${conflict.id}`,
      conflictId: conflict.id,
      action: 'cancel',
      eventId: event2.id,
      eventTitle: event2.title,
      suggestedTime: event2.time,
      suggestedDate: event2.date,
      reason: `Cancelar "${event2.title}" y mantener "${event1.title}"`
    });

    return of(suggestions).pipe(delay(400));
  }

  /**
   * Apply conflict resolution
   */
  applyResolution(resolution: ConflictResolution): Observable<boolean> {
    // In a real app, this would update the calendar service
    // For now, just simulate success
    console.log('Applying resolution:', resolution);
    return of(true).pipe(delay(500));
  }

  /**
   * Check if a new event would create conflicts with existing events
   */
  checkNewEventConflicts(
    newEvent: { date: string; time: string; duration: number },
    existingEvents: CalendarEvent[]
  ): Observable<CalendarEvent[]> {
    const conflictingEvents = existingEvents.filter(event => {
      // Only check events on the same day
      if (event.date !== newEvent.date) return false;

      const newStart = this.parseTime(newEvent.time);
      const newEnd = newStart + newEvent.duration;
      
      const existingStart = this.parseTime(event.time);
      const existingEnd = existingStart + event.duration;

      // Check if there's any overlap
      return !(newEnd <= existingStart || newStart >= existingEnd);
    });

    return of(conflictingEvents).pipe(delay(300));
  }

  /**
   * Get all active conflicts
   */
  getActiveConflicts(events: CalendarEvent[]): Observable<Conflict[]> {
    // Filter events to only future and today's events
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    const relevantEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= now;
    });

    return this.detectConflicts(relevantEvents);
  }

  /**
   * Get conflict count for a specific date
   */
  getConflictCountForDate(date: Date, events: CalendarEvent[]): Observable<number> {
    const dateString = date.toISOString().split('T')[0];
    const dayEvents = events.filter(e => e.date === dateString);
    
    // Simply return the count directly
    return of(dayEvents.length).pipe(delay(200));
  }
}
