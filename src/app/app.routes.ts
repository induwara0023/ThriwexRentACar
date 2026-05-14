import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'bookings',
    canActivate: [authGuard],
    loadComponent: () => import('./features/bookings/bookings.component').then(m => m.BookingsComponent)
  },
  {
    path: 'search',
    canActivate: [authGuard],
    loadComponent: () => import('./features/search/vehicle-search.component').then(m => m.VehicleSearchComponent)
  },
  {
    path: 'fleet',
    canActivate: [authGuard],
    loadComponent: () => import('./features/fleet/fleet.component').then(m => m.FleetComponent)
  },
  {
    path: 'fleet/new',
    canActivate: [authGuard],
    loadComponent: () => import('./features/fleet/vehicle-registration.component').then(m => m.VehicleRegistrationComponent)
  },
  {
    path: 'fleet/edit/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/fleet/vehicle-registration.component').then(m => m.VehicleRegistrationComponent)
  },
  {
    path: 'customers',
    canActivate: [authGuard],
    loadComponent: () => import('./features/customers/customers.component').then(m => m.CustomersComponent)
  },
  {
    path: 'customers/history',
    canActivate: [authGuard],
    loadComponent: () => import('./features/customers/customer-history.component').then(m => m.CustomerHistoryComponent)
  },
  {
    path: 'reports',
    canActivate: [authGuard],
    loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent)
  },
  {
    path: 'admins',
    canActivate: [authGuard],
    loadComponent: () => import('./features/admin-management/admin-management.component').then(m => m.AdminManagementComponent)
  },
  {
    path: 'drivers',
    canActivate: [authGuard],
    loadComponent: () => import('./features/admin-management/driver-management.component').then(m => m.DriverManagementComponent)
  },
  {
    path: 'hires',
    canActivate: [authGuard],
    loadComponent: () => import('./features/bookings/hire-booking.component').then(m => m.HireBookingComponent)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
