// App Routes Configuration

import { Routes } from '@angular/router';

export const routes: Routes = [
  // Default redirect
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  
  // Auth routes (no layout)
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
    title: 'Iniciar Sesión - Fitness App'
  },
  
  // Main app routes (with layout)
  {
    path: '',
    loadComponent: () => import('./shared/components/layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'Dashboard - Fitness App'
      },
      {
        path: 'plan-semanal',
        loadComponent: () => import('./features/calendar/plan-semanal/plan-semanal.component').then(m => m.PlanSemanalComponent),
        title: 'Plan Semanal - Fitness App'
      },
      {
        path: 'calendario',
        loadComponent: () => import('./features/calendar/plan-semanal/plan-semanal.component').then(m => m.PlanSemanalComponent),
        title: 'Calendario - Fitness App'
      },
      {
        path: 'historial',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'Historial - Fitness App'
      },
      {
        path: 'ajustes',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'Ajustes - Fitness App'
      }
    ]
  },
  
  // Wildcard route - 404
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
