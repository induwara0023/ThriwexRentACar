import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      <!-- Background Effects -->
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl"></div>

      <div class="w-full max-w-md bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700 shadow-2xl relative z-10">
        
        <div class="text-center mb-10">
          <div class="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20 mx-auto mb-6">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-white tracking-tight">Thriwex<span class="text-primary-400">Rent</span></h1>
          <p class="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mt-2">Enterprise System Access</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="space-y-6">
          <div *ngIf="errorMessage" class="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm font-medium text-center">
            {{ errorMessage }}
          </div>

          <div class="space-y-2">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Administrator Email</label>
            <input type="email" [(ngModel)]="email" name="email" required
              class="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3.5 text-sm text-white font-medium focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all placeholder:text-slate-600 outline-none"
              placeholder="admin@thriwex.com">
          </div>

          <div class="space-y-2">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Security Key</label>
            <input type="password" [(ngModel)]="password" name="password" required
              class="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3.5 text-sm text-white font-medium focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all placeholder:text-slate-600 outline-none"
              placeholder="••••••••">
          </div>

          <button type="submit" [disabled]="loading || !email || !password"
            class="w-full bg-primary-600 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] hover:bg-primary-500 transition-all shadow-xl shadow-primary-600/20 disabled:opacity-50 mt-4">
            {{ loading ? 'Authenticating...' : 'Secure Login' }}
          </button>
        </form>

        <div class="mt-8 text-center border-t border-slate-700/50 pt-6">
          <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">System Monitored & Secured</p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit() {
    this.loading = true;
    this.errorMessage = '';
    
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Invalid security credentials.';
      }
    });
  }
}
