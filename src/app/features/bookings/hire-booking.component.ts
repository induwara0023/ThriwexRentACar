import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-hire-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <!-- Header -->
      <header class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-bold text-slate-900 leading-tight">Hire Bookings</h1>
          <p class="text-slate-400 text-sm">Manage vehicle hires with distance-based pricing.</p>
        </div>
        <button (click)="openModal()" class="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-xl shadow-indigo-600/10">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
          Create Hire Booking
        </button>
      </header>

      <!-- Hires Table -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                <th class="px-6 py-4">Vehicle</th>
                <th class="px-6 py-4">Driver</th>
                <th class="px-6 py-4">Customer</th>
                <th class="px-6 py-4">Route</th>
                <th class="px-6 py-4">Costing</th>
                <th class="px-6 py-4">Status</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr *ngFor="let hire of hires" class="hover:bg-slate-50/50 transition-colors">
                <td class="px-6 py-4">
                  <div class="flex flex-col">
                    <span class="font-bold text-slate-700 text-sm">{{ hire.vehicle?.plate_no }}</span>
                    <span class="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{{ hire.vehicle?.model }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 font-medium text-slate-600 text-sm">{{ hire.driver?.name }}</td>
                <td class="px-6 py-4 font-medium text-slate-600 text-sm">{{ hire.customer?.name || hire.customer_name_manual }}</td>
                <td class="px-6 py-4 text-slate-500 text-xs italic">{{ hire.destination || 'N/A' }}</td>
                <td class="px-6 py-4">
                  <div class="flex flex-col items-end">
                    <span class="font-black text-slate-900 text-sm">LKR {{ hire.total_price | number }}</span>
                    <span class="text-[9px] text-slate-400 font-bold">{{ hire.distance_km }} KM &#64; {{ hire.rate_per_km }}/KM</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span [class]="'px-2 py-1 rounded-md text-[8px] font-bold uppercase tracking-widest ' + 
                    (hire.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 
                     hire.status === 'ongoing' ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600')">
                    {{ hire.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right space-x-2">
                  <button *ngIf="hire.status === 'ongoing'" (click)="completeHire(hire.id)" class="text-[10px] font-bold text-emerald-600 uppercase hover:bg-emerald-50 px-2 py-1 rounded transition-colors">Complete</button>
                  <button (click)="deleteHire(hire.id)" class="text-slate-300 hover:text-rose-500 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </td>
              </tr>
              <tr *ngIf="hires.length === 0">
                <td colspan="7" class="px-6 py-12 text-center text-slate-400 italic text-sm">No hire bookings recorded.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Hire Modal -->
      <div *ngIf="isModalOpen" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-3xl w-full max-w-2xl shadow-2xl animate-in zoom-in duration-200 overflow-hidden">
          <div class="p-6 border-b border-slate-50 flex justify-between items-center bg-indigo-50/50">
            <div>
              <h2 class="text-lg font-bold text-indigo-900">New Hire Assignment</h2>
              <p class="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1">Assign vehicle & driver with distance billing</p>
            </div>
            <button (click)="closeModal()" class="text-slate-400 hover:text-slate-600 bg-white p-2 rounded-xl shadow-sm transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          <form (submit)="saveHire($event)" class="p-8 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Select Hire Vehicle</label>
                <select name="vehicle_id" [(ngModel)]="formData.vehicle_id" required class="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none">
                  <option value="" disabled selected>Select a Vehicle</option>
                  <option *ngFor="let v of vehicles" [ngValue]="v.id">{{ v.plate_no }} - {{ v.model }}</option>
                </select>
              </div>
              <div>
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Select Driver</label>
                <select name="driver_id" [(ngModel)]="formData.driver_id" required class="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none">
                  <option value="" disabled selected>Select a Driver</option>
                  <option *ngFor="let d of drivers" [ngValue]="d.id">{{ d.name }} ({{ d.status }})</option>
                </select>
              </div>
              <div>
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Customer Name (Manual Entry)</label>
                <input type="text" name="customer_name_manual" [(ngModel)]="formData.customer_name_manual" required class="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
              </div>
              <div>
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Destination</label>
                <input type="text" name="destination" [(ngModel)]="formData.destination" class="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
              </div>
            </div>

            <!-- Pricing Calculator Section -->
            <div class="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
              <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mb-2">Pricing Calculator</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Estimated Distance (KM)</label>
                  <input type="number" name="distance_km" [(ngModel)]="formData.distance_km" (input)="calculatePrice()" required class="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Charge Per KM (LKR)</label>
                  <input type="number" name="rate_per_km" [(ngModel)]="formData.rate_per_km" (input)="calculatePrice()" required class="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                </div>
              </div>
              
              <div class="pt-4 border-t border-slate-200/60 flex flex-col items-center">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Estimated Total Price</span>
                <span class="text-4xl font-black text-indigo-600">LKR {{ formData.total_price | number }}</span>
              </div>
            </div>

            <div class="pt-2 flex gap-3">
              <button type="button" (click)="closeModal()" class="flex-1 px-6 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] text-slate-500 hover:bg-slate-50 transition-all border border-slate-100">Discard</button>
              <button type="submit" class="flex-[2] bg-indigo-600 text-white px-6 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">
                Confirm & Launch Hire
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class HireBookingComponent implements OnInit {
  hires: any[] = [];
  vehicles: any[] = [];
  drivers: any[] = [];
  isModalOpen = false;
  formData: any = {
    vehicle_id: null,
    driver_id: null,
    customer_id: null,
    customer_name_manual: '',
    distance_km: 0,
    rate_per_km: 0,
    total_price: 0,
    booking_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
    destination: '',
    status: 'ongoing'
  };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadHires();
    this.loadResources();
  }

  loadHires() {
    this.api.getHires().subscribe(res => this.hires = res);
  }

  loadResources() {
    this.api.getVehicles().subscribe((res: any) => {
      const allVehicles = res.data || res;
      // Filter only Hire type vehicles
      this.vehicles = allVehicles.filter((v: any) => (v.service_type || 'rent') === 'hire' && v.status === 'available');
    });
    this.api.getDrivers().subscribe((res: any) => {
      this.drivers = res.filter((d: any) => d.status === 'available');
    });
  }

  calculatePrice() {
    const distance = parseFloat(this.formData.distance_km) || 0;
    const rate = parseFloat(this.formData.rate_per_km) || 0;
    this.formData.total_price = distance * rate;
  }

  openModal() {
    this.formData = {
      vehicle_id: null,
      driver_id: null,
      customer_id: null,
      customer_name_manual: '',
      distance_km: 0,
      rate_per_km: 0,
      total_price: 0,
      booking_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
      destination: '',
      status: 'ongoing'
    };
    this.loadResources(); // Refresh lists
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveHire(event: Event) {
    event.preventDefault();
    this.api.saveHire(this.formData).subscribe({
      next: () => {
        this.loadHires();
        this.closeModal();
      },
      error: (err) => {
        console.error('Hire creation failed', err);
        const errors = err.error?.errors;
        if (errors) {
          const messages = Object.values(errors).flat().join('\n');
          alert('Validation Errors:\n' + messages);
        } else {
          alert(err.error?.message || 'Booking failed');
        }
      }
    });
  }

  completeHire(id: number) {
    if (confirm('Mark this hire as completed? This will release the vehicle and driver.')) {
      this.api.completeHire(id).subscribe(() => this.loadHires());
    }
  }

  deleteHire(id: number) {
    if (confirm('Are you sure you want to delete this record?')) {
      this.api.deleteHire(id).subscribe(() => this.loadHires());
    }
  }
}
