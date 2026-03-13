// Authentication Service - Mock authentication logic

import { Injectable, signal } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { User } from '../../models';
import { MOCK_USER } from '../data/mock-data';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Signal for current user (reactive state)
  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor() {
    // Check if user was previously logged in
    this.loadUserFromStorage();
  }

  /**
   * Mock login - accepts any email/password combination
   */
  login(email: string, password: string): Observable<User> {
    // Simulate API delay
    return of(MOCK_USER).pipe(
      delay(800),
      // In real app, validate credentials here
    );
  }

  /**
   * Set authenticated user and persist to localStorage
   */
  setCurrentUser(user: User): void {
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  /**
   * Logout user and clear localStorage
   */
  logout(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    localStorage.removeItem('currentUser');
  }

  /**
   * Load user from localStorage on app initialization
   */
  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser) as User;
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      } catch (error) {
        console.error('Error loading user from storage:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }

  /**
   * Get current user value (non-reactive)
   */
  getCurrentUser(): User | null {
    return this.currentUser();
  }

  /**
   * Check if user is authenticated (non-reactive)
   */
  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }
}
