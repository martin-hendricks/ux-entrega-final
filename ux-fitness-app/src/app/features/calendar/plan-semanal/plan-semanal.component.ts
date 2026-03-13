// Plan Semanal Component - Weekly calendar view

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatBadgeModule } from '@angular/material/badge';
import { CalendarService } from '../../../core/services/calendar.service';
import { ConflictService } from '../../../core/services/conflict.service';
import { SessionService } from '../../../core/services/session.service';
import { WeekView, DayEvent, CalendarEvent, Conflict } from '../../../models';
import { CreateSessionDialogComponent } from '../create-session-dialog/create-session-dialog.component';

@Component({
  selector: 'app-plan-semanal',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule,
    MatBadgeModule
  ],
  templateUrl: './plan-semanal.component.html',
  styleUrls: ['./plan-semanal.component.scss']
})
export class PlanSemanalComponent implements OnInit {
  weekView = signal<WeekView | null>(null);
  currentWeekStart = signal<Date>(new Date());
  conflicts = signal<Conflict[]>([]);
  isLoading = signal(true);

  weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  
  // Time slots for the day (6:00 AM to 10:00 PM)
  timeSlots = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00'
  ];

  constructor(
    private calendarService: CalendarService,
    private conflictService: ConflictService,
    private sessionService: SessionService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initializeWeek();
    this.loadWeekView();
  }

  initializeWeek(): void {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);
    this.currentWeekStart.set(startOfWeek);
  }

  loadWeekView(): void {
    this.isLoading.set(true);
    
    this.calendarService.getWeekView(this.currentWeekStart()).subscribe({
      next: (weekView) => {
        this.weekView.set(weekView);
        this.loadConflicts(weekView.days.flatMap(day => day.events));
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading week view:', error);
        this.isLoading.set(false);
      }
    });
  }

  loadConflicts(events: CalendarEvent[]): void {
    this.conflictService.detectConflicts(events).subscribe({
      next: (conflicts) => {
        this.conflicts.set(conflicts);
      },
      error: (error) => console.error('Error detecting conflicts:', error)
    });
  }

  previousWeek(): void {
    const newStart = new Date(this.currentWeekStart());
    newStart.setDate(newStart.getDate() - 7);
    this.currentWeekStart.set(newStart);
    this.loadWeekView();
  }

  nextWeek(): void {
    const newStart = new Date(this.currentWeekStart());
    newStart.setDate(newStart.getDate() + 7);
    this.currentWeekStart.set(newStart);
    this.loadWeekView();
  }

  goToToday(): void {
    this.initializeWeek();
    this.loadWeekView();
  }

  getDayName(dateString: string): string {
    const date = new Date(dateString);
    return this.weekDays[date.getDay()];
  }

  getDayNumber(dateString: string): number {
    const date = new Date(dateString);
    return date.getDate();
  }

  isToday(dateString: string): boolean {
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  getEventTypeIcon(type: string): string {
    const icons: { [key: string]: string } = {
    //   session: 'fitness_center',
    //   other: 'event'
    };
    return icons[type] || '';
  }

  formatTime(time: string): string {
    return time.substring(0, 5); // HH:MM
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }

  getWeekRange(): string {
    const days = this.weekView()?.days;
    if (!days || days.length === 0) return '';
    
    const firstDay = new Date(days[0].date);
    const lastDay = new Date(days[days.length - 1].date);
    
    const firstMonth = firstDay.toLocaleDateString('es-ES', { month: 'short' });
    const lastMonth = lastDay.toLocaleDateString('es-ES', { month: 'short' });
    
    if (firstMonth === lastMonth) {
      return `${firstDay.getDate()} - ${lastDay.getDate()} ${firstMonth} ${firstDay.getFullYear()}`;
    } else {
      return `${firstDay.getDate()} ${firstMonth} - ${lastDay.getDate()} ${lastMonth} ${firstDay.getFullYear()}`;
    }
  }

  getTotalEventsCount(): number {
    return this.weekView()?.days.reduce((sum, day) => sum + day.events.length, 0) || 0;
  }

  getTotalDistance(): number {
    let total = 0;
    this.weekView()?.days.forEach(day => {
      day.events.forEach(event => {
        if (event.sessionId) {
          const session = this.sessionService.getSessionByIdSync(event.sessionId);
          if (session && session.distance) {
            total += session.distance;
          }
        }
      });
    });
    return parseFloat(total.toFixed(1));
  }

  getAverageDuration(): number {
    const events = this.weekView()?.days.flatMap(day => day.events) || [];
    if (events.length === 0) return 0;
    const totalMinutes = events.reduce((sum, event) => sum + (event.duration || 0), 0);
    return Math.round(totalMinutes / events.length);
  }

  getConflictCount(): number {
    return this.conflicts().length;
  }

  openCreateEventDialog(): void {
    const dialogRef = this.dialog.open(CreateSessionDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      disableClose: false,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Session created successfully, refresh the week view
        this.loadWeekView();
      }
    });
  }

  openConflictAlert(): void {
    // In full implementation, this would open ConflictAlertDialogComponent
    if (this.getConflictCount() > 0) {
      console.log('Open conflict alert dialog');
    }
  }

  onEventClick(event: CalendarEvent): void {
    console.log('Event clicked:', event);
    // In full implementation, this would show event details or edit dialog
  }
}
