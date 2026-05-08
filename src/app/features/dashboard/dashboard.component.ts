import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Booking, Vehicle } from '../../core/models/api.models';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto space-y-4 md:space-y-6 animate-in fade-in duration-500">
      <!-- Summary Grid -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div class="bg-white p-4 sm:p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Total Fleet</p>
            <h3 class="text-2xl font-semibold text-slate-900 leading-tight">{{ stats.total_fleet }} <span class="text-[10px] text-slate-400 font-medium ml-1 uppercase">Vehicles</span></h3>
          </div>
          <div class="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
          </div>
        </div>

        <div class="bg-white p-4 sm:p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Available</p>
            <h3 class="text-2xl font-semibold text-emerald-600 leading-tight">{{ stats.available_now }} <span class="text-[10px] text-emerald-400 font-medium ml-1 uppercase">Ready</span></h3>
          </div>
          <div class="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        </div>

        <div class="bg-white p-4 sm:p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Active Hires</p>
            <h3 class="text-2xl font-semibold text-primary-600 leading-tight">{{ stats.ongoing_hires }} <span class="text-[10px] text-primary-400 font-medium ml-1 uppercase">Ongoing</span></h3>
          </div>
          <div class="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        </div>
      </section>

      <!-- Quick Intelligence -->
      <section>
        <div class="bg-slate-900 rounded-2xl p-4 sm:p-5 md:p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
          <div class="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          <div>
            <h2 class="text-lg font-bold text-white leading-tight mb-1">Customer Intelligence</h2>
            <p class="text-slate-500 text-xs font-medium uppercase tracking-widest">Verify Trust & History by NIC</p>
          </div>
          <div class="flex gap-2 w-full md:w-auto">
            <input type="text" [(ngModel)]="quickNic" placeholder="Search NIC..." (keyup.enter)="goToHistory()" 
              class="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white font-medium outline-none focus:border-primary-500 w-full md:w-64 transition-all">
            <button (click)="goToHistory()" class="bg-primary-600 text-white px-6 py-2 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-primary-700 transition-all">
              Verify
            </button>
          </div>
        </div>
      </section>

      <!-- Main Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        <!-- Ongoing Table -->
        <section class="lg:col-span-8">
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
            <div class="p-4 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
              <h2 class="text-xs font-semibold text-slate-700 uppercase tracking-widest">Active Operations</h2>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-left">
                <thead>
                  <tr class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                    <th class="px-6 py-3">Vehicle</th>
                    <th class="px-6 py-3">Client</th>
                    <th class="px-6 py-3">Expected Return</th>
                    <th class="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-50">
                  <tr *ngFor="let booking of ongoingRentals" class="hover:bg-slate-50 transition-colors">
                    <td class="px-6 py-4">
                      <p class="font-semibold text-slate-800 text-xs">{{ booking.vehicle?.plate_no }}</p>
                      <p class="text-[10px] text-slate-400 font-medium uppercase">{{ booking.vehicle?.model }}</p>
                    </td>
                    <td class="px-6 py-4">
                      <p class="font-semibold text-slate-700 text-xs">{{ booking.customer?.name }}</p>
                      <p class="text-[10px] text-slate-400">{{ booking.customer?.phone }}</p>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-2">
                        <span [class]="getReturnStatusClass(booking)"></span>
                        <p class="text-[10px] font-semibold" [ngClass]="isDelayed(booking) ? 'text-rose-600' : 'text-slate-600'">
                          {{ booking.return_datetime | date:'MMM d, h:mm a' }}
                        </p>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <button (click)="openCheckIn(booking)" class="bg-slate-900 text-white text-[10px] font-semibold uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-emerald-600 transition-all shadow-sm">
                        Check-in
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- Alerts -->
        <section class="lg:col-span-4 space-y-4 md:space-y-6">
          <div class="bg-white rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-slate-100 flex flex-col h-full">
             <h3 class="text-xs font-semibold text-slate-700 uppercase tracking-widest mb-4 md:mb-6">Service Required</h3>
             <div class="space-y-3">
               <div *ngFor="let alert of serviceAlerts" class="p-4 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-between">
                 <div>
                   <p class="text-[10px] font-bold text-amber-800 uppercase tracking-wider">{{ alert.plate_no }}</p>
                   <p class="text-xs font-medium text-amber-600 leading-tight">Service in {{ (alert.next_service_km || 0) - alert.current_km }} KM</p>
                 </div>
                 <div class="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-500">
                   <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                 </div>
               </div>
             </div>
          </div>
        </section>
      </div>

      <!-- Compact Check-in Modal -->
      <div *ngIf="selectedBooking" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" (click)="selectedBooking = null"></div>
        <div class="bg-white w-full max-w-md rounded-2xl shadow-2xl relative z-10 overflow-hidden animate-zoom-in border border-slate-100">
          <header class="p-5 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
            <div>
              <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Finalize Rental</h2>
              <p class="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{{ selectedBooking.vehicle?.plate_no }} • {{ selectedBooking.vehicle?.model }}</p>
            </div>
            <button (click)="selectedBooking = null" class="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </header>

          <div class="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <!-- Stats -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Pickup Reading</p>
                <p class="text-sm font-bold text-slate-800">{{ selectedBooking.pickup_km }} KM</p>
              </div>
              <div class="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Enter Return Reading (KM)</p>
                <input type="number" [(ngModel)]="returnKm" 
                  class="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-xl font-bold text-slate-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all shadow-sm placeholder:text-slate-300"
                  placeholder="e.g. 1500">
              </div>
            </div>

            <!-- Documentation -->
            <section *ngIf="selectedBooking.media && selectedBooking.media.length > 0" class="space-y-3">
              <h3 class="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Digital Documentation</h3>
              <div class="grid grid-cols-3 sm:grid-cols-5 gap-2">
                <a *ngFor="let m of selectedBooking.media" [href]="m.file_url" target="_blank" 
                   class="group relative h-12 bg-white border border-slate-100 rounded-lg flex items-center justify-center text-slate-300 hover:text-primary-600 hover:border-primary-200 transition-all shadow-sm">
                   <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                   <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      <span class="text-[8px] font-bold text-slate-400 uppercase bg-white px-1.5 py-0.5 rounded shadow-sm border border-slate-100">{{ m.type }}</span>
                   </div>
                </a>
              </div>
            </section>

            <!-- Breakdown -->
            <div *ngIf="(returnKm * 1) >= (selectedBooking.pickup_km * 1)" class="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <div class="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span>Duration ({{ calculatedDays }} Days)</span>
                <span class="text-slate-700">LKR {{ calculatedDays * (selectedBooking.vehicle?.daily_rate || 0) | number }}</span>
              </div>
              <div class="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-2 border-t border-slate-100">
                <span>Distance Traveled</span>
                <span class="text-slate-700">{{ calculatedTraveledKm }} KM / {{ calculatedAllowedKm }} KM</span>
              </div>
              <div class="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span [class.text-rose-500]="calculatedExcessKm > 0">Excess KM ({{ calculatedExcessKm }} KM)</span>
                <span [class.text-rose-500]="calculatedExcessKm > 0">LKR {{ calculatedExcessKm * (selectedBooking.vehicle?.extra_km_rate || 0) | number }}</span>
              </div>
              <div class="flex justify-between items-center text-[10px] font-bold text-emerald-600 uppercase tracking-widest pt-2 border-t border-slate-200">
                <span>Advance Payment</span>
                <span>- LKR {{ selectedBooking.advance_payment | number }}</span>
              </div>
              <div class="flex justify-between items-center pt-4 border-t border-slate-200">
                <span class="text-xs font-bold text-slate-900 uppercase">Balance Due</span>
                <span class="text-xl font-bold text-primary-600">LKR {{ calculatedBalance | number }}</span>
              </div>
            </div>

            <button (click)="finalizeCheckIn()" [disabled]="submitting || (returnKm * 1) < (selectedBooking.pickup_km * 1)" 
              class="w-full bg-slate-900 text-white py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl shadow-slate-900/10">
              {{ submitting ? 'Finalizing...' : 'Complete & Release' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class DashboardComponent implements OnInit {
  stats = { total_fleet: 0, available_now: 0, ongoing_hires: 0 };
  ongoingRentals: Booking[] = [];
  serviceAlerts: Vehicle[] = [];
  
  selectedBooking: Booking | null = null;
  returnKm: number = 0;
  submitting = false;
  quickNic = '';

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() { this.loadData(); }

  loadData() {
    this.api.getDashboardSummary().subscribe((res: any) => {
      this.stats = res.stats;
      this.ongoingRentals = res.ongoing_rentals;
      this.serviceAlerts = res.service_alerts;
    });
  }

  isDelayed(booking: Booking): boolean {
    return new Date(booking.return_datetime) < new Date();
  }

  getReturnStatusClass(booking: Booking): string {
    return this.isDelayed(booking) ? 'badge-delayed' : 'badge-due';
  }

  openCheckIn(booking: Booking) {
    this.selectedBooking = booking;
    this.returnKm = booking.pickup_km;
  }

  get calculatedDays() {
    if (!this.selectedBooking) return 1;
    const safePickupStr = this.selectedBooking.pickup_datetime.replace(' ', 'T');
    const safeReturnStr = this.selectedBooking.return_datetime.replace(' ', 'T');
    const start = new Date(safePickupStr);
    const expectedEnd = new Date(safeReturnStr);
    const actualEnd = new Date();
    
    // If returned early, charge for the agreed duration. If returned late, charge until now.
    const end = actualEnd > expectedEnd ? actualEnd : expectedEnd;

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 1;
    return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  }

  get calculatedTraveledKm() {
    if (!this.selectedBooking) return 0;
    const currentReturn = Number(this.returnKm) || 0;
    const pickupKm = Number(this.selectedBooking.pickup_km) || 0;
    return Math.max(0, currentReturn - pickupKm);
  }

  get calculatedAllowedKm() {
    if (!this.selectedBooking || !this.selectedBooking.vehicle) return 0;
    const limitPerDay = Number(this.selectedBooking.vehicle.km_limit_per_day) || 0;
    return this.calculatedDays * limitPerDay;
  }

  get calculatedExcessKm() {
    const traveled = this.calculatedTraveledKm;
    const allowed = this.calculatedAllowedKm;
    return Math.max(0, traveled - allowed);
  }

  get calculatedBalance() {
    if (!this.selectedBooking || !this.selectedBooking.vehicle) return 0;
    const dailyRate = Number(this.selectedBooking.vehicle.daily_rate) || 0;
    const extraKmRate = Number(this.selectedBooking.vehicle.extra_km_rate) || 0;
    const dayCharge = this.calculatedDays * dailyRate;
    const excessCharge = this.calculatedExcessKm * extraKmRate;
    const totalCost = dayCharge + excessCharge;
    const advance = Number(this.selectedBooking.advance_payment) || 0;
    return Math.round(totalCost - advance);
  }

  finalizeCheckIn() {
    if (!this.selectedBooking) return;
    this.submitting = true;
    const payload = {
      return_km: this.returnKm,
      return_datetime: new Date().toISOString()
    };

    this.api.completeBooking(this.selectedBooking.id, payload).subscribe({
      next: (res: any) => {
        alert(`Booking Finalized!\nBalance Collected: LKR ${this.calculatedBalance}`);
        this.selectedBooking = null;
        this.loadData();
        this.submitting = false;
      },
      error: () => {
        alert('Check-in failed.');
        this.submitting = false;
      }
    });
  }

  goToHistory() {
    if (!this.quickNic) return;
    this.router.navigate(['/customers/history'], { queryParams: { nic: this.quickNic } });
  }
}
