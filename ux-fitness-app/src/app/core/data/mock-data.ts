// Mock Data - Sample data for development and testing

import { User, Session, CalendarEvent } from '../../models';

/**
 * Mock User Data
 */
export const MOCK_USER: User = {
  id: 'user-001',
  email: 'usuario@fitness.com',
  name: 'Carlos Martínez',
  profile: {
    avatar: 'https://i.pravatar.cc/150?img=12',
    age: 28,
    weight: 75,
    height: 178,
    goals: ['Mejorar resistencia', 'Perder peso', 'Preparar maratón'],
    preferredActivities: ['running', 'cycling', 'swimming']
  },
  stats: {
    totalDistance: 245.8,
    totalSessions: 42,
    averagePace: 5.2,
    weeklyGoal: 50,
    weeklyProgress: 32
  }
};

/**
 * Mock Sessions Data
 */
export const MOCK_SESSIONS: Session[] = [
  // Current week sessions
  {
    id: 'session-001',
    userId: 'user-001',
    type: 'running',
    title: 'Carrera Matutina',
    date: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 1)).toISOString().split('T')[0], // Monday
    time: '07:00',
    duration: 45,
    distance: 8.5,
    intensity: 'moderate',
    status: 'completed',
    location: 'Parque Central',
    notes: 'Buen ritmo, clima perfecto',
    caloriesBurned: 420
  },
  {
    id: 'session-002',
    userId: 'user-001',
    type: 'cycling',
    title: 'Ciclismo de Ruta',
    date: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 3)).toISOString().split('T')[0], // Wednesday
    time: '18:00',
    duration: 90,
    distance: 35.2,
    intensity: 'high',
    status: 'completed',
    location: 'Ruta de Montaña',
    caloriesBurned: 680
  },
  {
    id: 'session-003',
    userId: 'user-001',
    type: 'running',
    title: 'Carrera Intervalos',
    date: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 5)).toISOString().split('T')[0], // Friday
    time: '06:30',
    duration: 60,
    distance: 10.0,
    intensity: 'high',
    status: 'planned',
    location: 'Pista de Atletismo',
    notes: 'Intervalos 400m x 8'
  },
  {
    id: 'session-004',
    userId: 'user-001',
    type: 'swimming',
    title: 'Natación Técnica',
    date: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 6)).toISOString().split('T')[0], // Saturday
    time: '09:00',
    duration: 75,
    distance: 3.0,
    intensity: 'moderate',
    status: 'planned',
    location: 'Piscina Municipal',
    notes: 'Trabajo de técnica de brazada'
  },
  // Next week sessions
  {
    id: 'session-005',
    userId: 'user-001',
    type: 'running',
    title: 'Carrera Larga',
    date: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 8)).toISOString().split('T')[0], // Next Monday
    time: '07:00',
    duration: 120,
    distance: 18.0,
    intensity: 'low',
    status: 'planned',
    location: 'Ruta Forestal',
    notes: 'Carrera de recuperación'
  },
  {
    id: 'session-006',
    userId: 'user-001',
    type: 'cycling',
    title: 'Ciclismo Recuperación',
    date: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 10)).toISOString().split('T')[0], // Next Wednesday
    time: '17:30',
    duration: 60,
    distance: 25.0,
    intensity: 'low',
    status: 'planned',
    location: 'Ciclovía Urbana'
  },
  // Past sessions (for history)
  {
    id: 'session-007',
    userId: 'user-001',
    type: 'running',
    title: 'Carrera Fácil',
    date: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
    time: '06:00',
    duration: 40,
    distance: 7.2,
    intensity: 'low',
    status: 'completed',
    location: 'Vecindario',
    caloriesBurned: 350
  },
  {
    id: 'session-008',
    userId: 'user-001',
    type: 'hiking',
    title: 'Senderismo',
    date: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString().split('T')[0],
    time: '08:00',
    duration: 180,
    distance: 12.5,
    intensity: 'moderate',
    status: 'completed',
    location: 'Cerro del Águila',
    notes: 'Sendero técnico con buenas vistas',
    caloriesBurned: 890
  }
];

/**
 * Mock Calendar Events Data
 */
export const MOCK_CALENDAR_EVENTS: CalendarEvent[] = [
  // Current week events
  {
    id: 'event-001',
    title: 'PLANNING SPRINT',
    date: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 1)).toISOString().split('T')[0], // Monday
    time: '07:00',
    duration: 45,
    type: 'session',
    sessionId: 'session-001',
    color: '#00C2FF',
    hasConflict: false
  },
  {
    id: 'event-003',
    title: 'Ciclismo de Ruta',
    date: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 3)).toISOString().split('T')[0], // Wednesday
    time: '18:00',
    duration: 90,
    type: 'session',
    sessionId: 'session-002',
    color: '#00C2FF',
    hasConflict: false
  },
  {
    id: 'event-004',
    title: 'REVIEW',
    date: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 4)).toISOString().split('T')[0], // Thursday
    time: '16:00',
    duration: 45,
    type: 'other',
    color: '#00C2FF',
    hasConflict: false
  },
//   {
//     id: 'event-005',
//     title: 'Carrera Intervalos',
//     date: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 5)).toISOString().split('T')[0], // Friday
//     time: '06:30',
//     duration: 60,
//     type: 'session',
//     sessionId: 'session-003',
//     color: '#00C2FF',
//     hasConflict: false
//   },
//   {
//     id: 'event-006',
//     title: 'Yoga',
//     date: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 5)).toISOString().split('T')[0], // Friday
//     time: '19:00',
//     duration: 60,
//     type: 'other',
//     color: '#4CAF50',
//     hasConflict: false
//   },
//   {
//     id: 'event-007',
//     title: 'Natación Técnica',
//     date: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 6)).toISOString().split('T')[0], // Saturday
//     time: '09:00',
//     duration: 75,
//     type: 'session',
//     sessionId: 'session-004',
//     color: '#00C2FF',
//     hasConflict: false
//   },
//   {
//     id: 'event-008',
//     title: 'Almuerzo Familiar',
//     date: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 6)).toISOString().split('T')[0], // Saturday
//     time: '13:00',
//     duration: 120,
//     type: 'other',
//     color: '#00C2FF',
//     hasConflict: false
//   },

];

/**
 * Helper function to get today's date string
 */
export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Helper function to get date string for offset days
 */
export function getDateString(daysOffset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
}
