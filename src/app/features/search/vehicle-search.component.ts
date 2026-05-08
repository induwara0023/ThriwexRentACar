import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Vehicle } from '../../core/models/api.models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehicle-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <!-- Search Header -->
      <header class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between gap-6">
        <div>
          <h1 class="text-xl font-bold text-slate-900 leading-tight">Availability Intelligence</h1>
          <p class="text-slate-400 text-sm">Scan fleet status for scheduled operations.</p>
        </div>
        <div class="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 border border-slate-100">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </header>

      <!-- Search Bar -->
      <div class="bg-slate-900 rounded-2xl p-8 shadow-xl relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div class="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div class="space-y-1.5">
            <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Pickup Schedule</label>
            <input type="datetime-local" [(ngModel)]="startTime" 
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-medium outline-none focus:border-primary-500 transition-all">
          </div>

          <div class="space-y-1.5">
            <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Return Schedule</label>
            <input type="datetime-local" [(ngModel)]="endTime" 
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-medium outline-none focus:border-primary-500 transition-all">
          </div>

          <button (click)="search()" [disabled]="loading || !isValidRange" 
            class="h-[42px] bg-primary-600 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-xl shadow-primary-600/20 hover:bg-primary-700 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-20">
            <svg *ngIf="!loading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <span *ngIf="loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            {{ loading ? 'Scanning...' : 'Verify Availability' }}
          </button>
        </div>

        <p *ngIf="!isValidRange && startTime && endTime" class="text-rose-400 text-[10px] font-bold uppercase tracking-widest mt-4 ml-1">
          ⚠️ Operational timeframe invalid: Return must follow Pickup.
        </p>
      </div>

      <!-- Results Grid -->
      <div *ngIf="searched" class="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
        <div class="flex items-center justify-between px-2">
          <h2 class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Available Fleet Records <span class="text-primary-600 ml-2">({{ availableVehicles.length }} Units)</span>
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div *ngFor="let vehicle of availableVehicles" 
            class="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col">
            
            <div class="h-40 bg-slate-100 relative overflow-hidden">
               <img [src]="vehicle.image_url" 
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
               <div class="absolute top-4 right-4 bg-emerald-500 text-white px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest shadow-sm">
                 Ready
               </div>
            </div>

            <div class="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-1">
                  <h3 class="text-sm font-bold text-slate-800">{{ vehicle.model }}</h3>
                  <span class="text-primary-600 font-bold text-xs">LKR {{ vehicle.daily_rate | number }}</span>
                </div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">{{ vehicle.plate_no }}</p>

                <div class="grid grid-cols-2 gap-3 mb-6">
                   <div class="p-2 bg-slate-50 rounded-lg border border-slate-100 text-center">
                      <p class="text-[8px] font-bold text-slate-400 uppercase">Class</p>
                      <p class="text-[10px] font-bold text-slate-700">{{ vehicle.type }}</p>
                   </div>
                   <div class="p-2 bg-slate-50 rounded-lg border border-slate-100 text-center">
                      <p class="text-[8px] font-bold text-slate-400 uppercase">System</p>
                      <p class="text-[10px] font-bold text-slate-700">{{ vehicle.transmission }}</p>
                   </div>
                </div>
              </div>

              <button (click)="bookNow(vehicle)" 
                class="w-full py-2.5 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest text-[9px] hover:bg-primary-600 transition-all shadow-xl shadow-slate-900/10">
                Proceed to Contract
              </button>
            </div>
          </div>
        </div>

        <!-- No Results -->
        <div *ngIf="availableVehicles.length === 0" class="py-20 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <div class="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h3 class="text-sm font-bold text-slate-800 uppercase tracking-widest">No Operational Units Found</h3>
          <p class="text-slate-400 text-xs font-medium mt-1">Adjust timeframe or fleet criteria.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-slide-up {
      animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `]
})
export class VehicleSearchComponent {
  startTime = '';
  endTime = '';
  availableVehicles: Vehicle[] = [];
  loading = false;
  searched = false;

  constructor(private api: ApiService, private router: Router) {}

  get isValidRange(): boolean {
    if (!this.startTime || !this.endTime) return false;
    return new Date(this.endTime) > new Date(this.startTime);
  }

  search() {
    if (!this.isValidRange) return;

    this.loading = true;
    this.api.getAvailableVehicles(this.startTime, this.endTime).subscribe({
      next: (res: any) => {
        this.availableVehicles = res.data || res;
        this.loading = false;
        this.searched = true;
      },
      error: () => {
        alert('Search failed. Please try again.');
        this.loading = false;
      }
    });
  }

  bookNow(vehicle: Vehicle) {
    // Navigate to booking with pre-filled data (this can be passed via service or state)
    this.router.navigate(['/bookings'], { 
      queryParams: { 
        vehicle_id: vehicle.id,
        start: this.startTime,
        end: this.endTime
      } 
    });
  }
}
