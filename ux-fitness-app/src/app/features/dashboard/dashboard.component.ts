// Dashboard Component

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SessionService } from '../../core/services/session.service';
import { AuthService } from '../../core/services/auth.service';
import { User, SessionSummary, UpcomingSession } from '../../models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUser = signal<User | null>(null);
  sessionSummary = signal<SessionSummary | null>(null);
  upcomingSessions = signal<UpcomingSession[]>([]);
  isLoading = signal(true);

  constructor(
    private sessionService: SessionService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading.set(true);
    this.currentUser.set(this.authService.getCurrentUser());

    // Load session summary
    this.sessionService.getSessionSummary().subscribe({
      next: (summary) => {
        this.sessionSummary.set(summary);
      },
      error: (error) => console.error('Error loading session summary:', error)
    });

    // Load upcoming sessions
    this.sessionService.getUpcomingSessions().subscribe({
      next: (sessions) => {
        this.upcomingSessions.set(sessions);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading upcoming sessions:', error);
        this.isLoading.set(false);
      }
    });
  }

  getWeeklyProgress(): number {
    const stats = this.currentUser()?.stats;
    if (!stats) return 0;
    return (stats.weeklyProgress / stats.weeklyGoal) * 100;
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Mañana';
    } else {
      return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' });
    }
  }

  getSessionTypeIcon(type: string): string {
    const icons: { [key: string]: string } = {
      running: 'directions_run',
      cycling: 'directions_bike',
      swimming: 'pool',
      hiking: 'hiking',
      other: 'fitness_center'
    };
    return icons[type] || 'fitness_center';
  }
}
