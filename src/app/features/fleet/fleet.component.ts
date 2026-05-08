import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Vehicle, Booking } from '../../core/models/api.models';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-fleet',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto space-y-4 md:space-y-6 animate-in fade-in duration-500">
      <!-- Header & Operations -->
      <header class="bg-white rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 text-center md:text-left">
        <div class="w-full md:w-auto">
          <h1 class="text-xl font-bold text-slate-900 leading-tight">Fleet Operations</h1>
          <p class="text-slate-400 text-sm">Real-time inventory and maintenance tracking.</p>
        </div>

        <div class="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div class="flex flex-wrap justify-center items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100 w-full sm:w-auto">
            <button (click)="filterStatus = 'all'" [class]="getFilterClass('all')">All</button>
            <button (click)="filterStatus = 'available'" [class]="getFilterClass('available')">Ready</button>
            <button (click)="filterStatus = 'rented'" [class]="getFilterClass('rented')">On Hire</button>
            <button (click)="filterStatus = 'maintenance'" [class]="getFilterClass('maintenance')">Service</button>
          </div>
          <button routerLink="/fleet/new" class="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
            Add Vehicle
          </button>
        </div>
      </header>

      <!-- Vehicle Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div *ngFor="let vehicle of filteredVehicles" 
             (click)="selectVehicle(vehicle)"
             class="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer overflow-hidden flex flex-col">
          
          <!-- Image Section -->
          <div class="h-44 relative overflow-hidden bg-slate-100">
             <img [src]="vehicle.image_url" 
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
             <div class="absolute top-4 left-4">
               <span class="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider shadow-sm"
                 [ngClass]="{
                   'bg-emerald-500 text-white': vehicle.status === 'available',
                   'bg-rose-500 text-white': vehicle.status === 'rented',
                   'bg-amber-500 text-white': vehicle.status === 'maintenance'
                 }">
                 {{ vehicle.status === 'available' ? 'Ready' : vehicle.status === 'rented' ? 'On Hire' : 'Service' }}
               </span>
             </div>
          </div>

          <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
              <h3 class="text-sm font-bold text-slate-800 leading-tight mb-1">{{ vehicle.model }}</h3>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{{ vehicle.plate_no }}</p>

              <!-- Service Tracker -->
              <div class="space-y-2 mb-6">
                <div class="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest">
                  <span class="text-slate-400">Maintenance</span>
                  <span [class]="getServiceRemaining(vehicle) < 1000 ? 'text-rose-500' : 'text-slate-600'">
                    {{ getServiceRemaining(vehicle) | number }} KM Left
                  </span>
                </div>
                <div class="h-1 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                  <div class="h-full transition-all duration-1000" 
                       [style.width.%]="getServiceProgress(vehicle)"
                       [ngClass]="getServiceProgress(vehicle) > 80 ? 'bg-rose-500' : 'bg-primary-500'"></div>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between pt-4 border-t border-slate-50">
               <div>
                 <p class="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Base Rate</p>
                 <p class="text-sm font-bold text-slate-900">LKR {{ vehicle.daily_rate | number }}</p>
               </div>
               <div class="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-primary-600 group-hover:text-white transition-all shadow-sm">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
               </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Vehicle Detail Side-Panel -->
      <div *ngIf="selectedVehicle" class="fixed inset-0 z-[100] flex justify-end">
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" (click)="selectedVehicle = null"></div>
        <aside class="w-full max-w-md bg-white h-full shadow-2xl relative z-10 overflow-y-auto animate-in slide-in-from-right duration-500 border-l border-slate-100">
          <header class="p-4 sm:p-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
            <div>
              <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Asset Intelligence</h2>
              <p class="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Vehicle Performance Profile</p>
            </div>
            <button (click)="selectedVehicle = null" class="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </header>

          <div class="p-4 sm:p-6 space-y-6 md:space-y-8">
            <!-- Hero -->
            <div class="space-y-2 text-center">
              <h2 class="text-2xl font-bold text-slate-900 leading-tight">{{ selectedVehicle.model }}</h2>
              <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">{{ selectedVehicle.plate_no }}</p>
              <div class="pt-4 flex justify-center">
                 <button [routerLink]="['/fleet/edit', selectedVehicle.id]" class="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-900 rounded-lg text-[9px] font-bold text-white uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">
                   <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                   Edit Asset
                 </button>
              </div>
            </div>

            <!-- Performance Grid -->
            <div class="grid grid-cols-2 gap-4">
              <div class="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <p class="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">Operational Yield</p>
                <p class="text-lg font-bold text-emerald-600">LKR {{ totalRevenue | number }}</p>
              </div>
              <div class="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <p class="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">Total Cycles</p>
                <p class="text-lg font-bold text-primary-600">{{ rentalHistory.length }} Hires</p>
              </div>
            </div>

            <!-- Compliance -->
            <section class="space-y-4">
              <h3 class="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Compliance Status</h3>
              <div class="space-y-2">
                <div class="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                  <span class="text-xs font-bold text-slate-600">Insurance Expiry</span>
                  <span class="text-xs font-bold text-rose-500">{{ selectedVehicle.insurance_expiry | date:'MMM d, yyyy' }}</span>
                </div>
                <div class="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                  <span class="text-xs font-bold text-slate-600">License Expiry</span>
                  <span class="text-xs font-bold text-amber-500">{{ selectedVehicle.license_expiry | date:'MMM d, yyyy' }}</span>
                </div>
              </div>
            </section>

            <!-- Activity -->
            <section class="space-y-4">
              <h3 class="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Operational History</h3>
              <div *ngIf="loadingHistory" class="flex justify-center py-6">
                <div class="w-5 h-5 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
              </div>
              
              <div *ngIf="!loadingHistory && rentalHistory.length > 0" class="space-y-3">
                <div *ngFor="let hire of rentalHistory" class="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between transition-hover hover:bg-white transition-colors">
                   <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg bg-white border border-slate-100 text-slate-400 flex items-center justify-center font-bold text-[10px] uppercase">
                        {{ hire.customer?.name?.charAt(0) }}
                      </div>
                      <div>
                        <p class="text-xs font-bold text-slate-800">{{ hire.customer?.name }}</p>
                        <p class="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                          {{ hire.pickup_datetime | date:'MMM d' }} • {{ (hire.total_price || 0) | number }} LKR
                        </p>
                      </div>
                   </div>
                   <div class="w-6 h-6 rounded-md bg-white border border-slate-100 flex items-center justify-center text-slate-300">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
                   </div>
                </div>
              </div>

              <div *ngIf="!loadingHistory && rentalHistory.length === 0" class="p-10 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p class="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-loose">No operational<br>records found</p>
              </div>
            </section>
          </div>
        </aside>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .nav-btn {
      @apply px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-widest text-slate-400 transition-all duration-200;
    }
    .btn-active {
      @apply bg-slate-900 text-white shadow-md;
    }
  `]
})
export class FleetComponent implements OnInit {
  vehicles: Vehicle[] = [];
  filterStatus: 'all' | 'available' | 'rented' | 'maintenance' = 'all';
  selectedVehicle: Vehicle | null = null;
  rentalHistory: any[] = [];
  loadingHistory = false;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getVehicles().subscribe((res: any) => {
      this.vehicles = res.data || res;
    });
  }

  get filteredVehicles() {
    if (this.filterStatus === 'all') return this.vehicles;
    return this.vehicles.filter(v => v.status === this.filterStatus);
  }

  get totalRevenue() {
    return this.rentalHistory.reduce((sum, hire) => sum + (parseFloat(hire.total_price) || 0), 0);
  }

  getFilterClass(status: string) {
    return `nav-btn ${this.filterStatus === status ? 'btn-active' : 'hover:bg-slate-50'}`;
  }

  getStatusClass(status: string) {
    return `badge-${status}`;
  }

  getServiceProgress(vehicle: Vehicle) {
    const total = vehicle.next_service_km || 5000;
    return Math.min(100, (vehicle.current_km / total) * 100);
  }

  getServiceRemaining(vehicle: Vehicle) {
    return (vehicle.next_service_km || 5000) - vehicle.current_km;
  }

  selectVehicle(vehicle: Vehicle) {
    this.selectedVehicle = vehicle;
    this.loadHistory(vehicle.id);
  }

  loadHistory(id: number) {
    this.loadingHistory = true;
    this.rentalHistory = [];
    this.api.getVehicleHistory(id).subscribe({
      next: (res: any) => {
        this.rentalHistory = res.data || res;
        this.loadingHistory = false;
      },
      error: () => this.loadingHistory = false
    });
  }
}
