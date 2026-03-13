// User Model - Represents a user of the fitness app

export interface User {
  id: string;
  name: string;
  email: string;
  profile?: UserProfile;
  stats: UserStats;
}

export interface UserProfile {
  avatar?: string;
  age?: number;
  weight?: number;            // in kg
  height?: number;            // in cm
  goals?: string[];
  preferredActivities?: string[];
}

export interface UserStats {
  totalDistance: number;      // in kilometers
  totalSessions: number;
  averagePace: number;         // in min/km
  weeklyGoal: number;          // in kilometers
  weeklyProgress: number;      // in kilometers (not percentage)
}
