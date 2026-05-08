import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Vehicle, Customer } from '../../core/models/api.models';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  template: `
    <div class="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <!-- Minimalist Wizard Header -->
      <div class="flex items-center justify-center space-x-3">
        <ng-container *ngFor="let step of [1,2,3,4]; let last = last">
          <div [class]="'w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-bold transition-all border ' + 
               (currentStep >= step ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/10' : 'bg-white text-slate-300 border-slate-100')">
            {{ step }}
          </div>
          <div *ngIf="!last" class="w-8 h-[1px]" [ngClass]="currentStep > step ? 'bg-slate-900' : 'bg-slate-100'"></div>
        </ng-container>
      </div>

      <!-- Step 1: ID Search -->
      <div *ngIf="currentStep === 1" class="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-slate-100 animate-in slide-in-from-bottom-4 duration-500">
        <header class="mb-8 flex items-center justify-between">
          <div>
            <h2 class="text-lg font-bold text-slate-900 leading-tight">Identity Verification</h2>
            <p class="text-slate-400 text-xs mt-1 uppercase tracking-widest font-bold">Step 1: Security Clearance</p>
          </div>
          <div class="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 border border-slate-100">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 21h4m-2-3v3m5-10V7a5 5 0 00-10 0v4m-1 9h12a2 2 0 002-2v-5a2 2 0 00-2-2H5a2 2 0 00-2 2v5a2 2 0 002 2z" /></svg>
          </div>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div class="md:col-span-7 space-y-6">
            <div class="space-y-1.5">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Search NIC Number</label>
              <div class="relative group">
                <input type="text" [(ngModel)]="nicQuery" (input)="onNicSearch()" 
                  class="enterprise-input !py-4 !px-6 !text-sm" placeholder="Search by NIC...">
                <div class="absolute right-4 top-1/2 -translate-y-1/2">
                   <div *ngIf="foundCustomer" class="w-2 h-2 rounded-full" [ngClass]="foundCustomer.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'"></div>
                </div>
              </div>
            </div>

            <!-- Profile Status -->
            <div *ngIf="foundCustomer" class="animate-in zoom-in duration-300">
              <div *ngIf="foundCustomer.status === 'blacklisted'" 
                   class="p-5 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-4">
                <div class="w-10 h-10 bg-rose-600 text-white rounded-lg flex items-center justify-center shadow-lg shadow-rose-600/20">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <div>
                  <h4 class="text-rose-600 font-bold uppercase text-[9px] tracking-widest">Security Blacklist</h4>
                  <p class="text-rose-800 text-xs font-semibold">Rental prohibited for this user.</p>
                </div>
              </div>

              <div *ngIf="foundCustomer.status === 'active'" class="p-6 bg-emerald-50 border border-emerald-100 rounded-xl">
                <div class="flex items-center justify-between mb-2">
                  <h4 class="text-emerald-600 font-bold uppercase text-[9px] tracking-widest">Verified Profile</h4>
                  <span class="text-[8px] bg-white text-emerald-600 px-1.5 py-0.5 rounded font-bold border border-emerald-100 uppercase tracking-widest">Active</span>
                </div>
                <h3 class="text-lg font-bold text-slate-800 leading-tight">{{ foundCustomer.name }}</h3>
                <p class="text-slate-500 text-xs font-medium mt-0.5">{{ foundCustomer.phone }}</p>
              </div>
            </div>
          </div>

          <div class="md:col-span-5 bg-slate-50 rounded-2xl border border-slate-100 p-4 sm:p-6 md:p-8 text-center flex flex-col items-center justify-center min-h-[200px]">
            <div *ngIf="!foundCustomer" class="space-y-3">
              <svg class="w-8 h-8 text-slate-200 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Awaiting Verification</p>
            </div>
            <div *ngIf="foundCustomer" class="space-y-3">
               <button [routerLink]="['/customers/history']" [queryParams]="{ nic: foundCustomer.nic_no }" class="text-[9px] font-bold text-primary-600 uppercase tracking-widest bg-white px-3 py-2 rounded-lg border border-primary-100 hover:bg-primary-50 transition-colors">
                  View Intelligence History
               </button>
            </div>
          </div>
        </div>

        <div class="mt-10 flex justify-end">
          <button (click)="nextStep()" [disabled]="!foundCustomer || foundCustomer.status === 'blacklisted'" 
            class="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all disabled:opacity-20 shadow-xl shadow-slate-900/10">
            Select Vehicle
          </button>
        </div>
      </div>

      <!-- Step 2: Vehicle & Dates -->
      <div *ngIf="currentStep === 2" class="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-slate-100 animate-in slide-in-from-bottom-4 duration-500">
        <header class="mb-8">
          <h2 class="text-lg font-bold text-slate-900 leading-tight">Fleet Allocation</h2>
          <p class="text-slate-400 text-xs mt-1 uppercase tracking-widest font-bold">Step 2: Operations & Scheduling</p>
        </header>
        
        <form [formGroup]="rentalForm" class="space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-1.5">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Pickup Schedule</label>
              <input type="datetime-local" formControlName="pickup_datetime" (change)="onDateChange()" class="enterprise-input">
            </div>
            <div class="space-y-1.5">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Expected Return</label>
              <input type="datetime-local" formControlName="return_datetime" (change)="onDateChange()" class="enterprise-input">
            </div>
            
            <div class="space-y-1.5">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Available Fleet</label>
              <select formControlName="vehicle_id" (change)="onVehicleSelect()" class="enterprise-input appearance-none">
                <option value="">{{ loadingVehicles ? 'Scanning Fleet...' : 'Select Vehicle' }}</option>
                <option *ngFor="let vehicle of availableVehicles" [value]="vehicle.id">
                  {{ vehicle.model }} ({{ vehicle.plate_no }}) • Rs. {{ vehicle.daily_rate | number }}/day
                </option>
              </select>
            </div>

            <div class="space-y-1.5">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Initial Meter (KM)</label>
              <input type="number" formControlName="pickup_km" class="enterprise-input" placeholder="0">
            </div>

            <div class="md:col-span-2 bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-center justify-between">
               <div>
                 <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Financial Estimate</p>
                 <h3 class="text-xl font-bold text-slate-900 leading-tight">LKR {{ estimatedPrice | number }}</h3>
               </div>
               <div class="text-right">
                 <p class="text-[10px] font-bold text-slate-500 uppercase">{{ estimatedDays }} Operations Days</p>
                 <p class="text-[8px] text-slate-400 font-bold uppercase mt-1 tracking-wider">+ {{ rentalForm.get('buffer_hours')?.value }}HR Buffer Enforced</p>
               </div>
            </div>
          </div>
        </form>

        <div class="mt-10 flex justify-between">
          <button (click)="prevStep()" class="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-6 py-2 hover:text-slate-900 transition-colors">Back</button>
          <button (click)="nextStep()" [disabled]="rentalForm.invalid || availableVehicles.length === 0" 
            class="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all disabled:opacity-20 shadow-xl shadow-slate-900/10">
            Digital Assets
          </button>
        </div>
      </div>

      <!-- Step 3: Digital Assets -->
      <div *ngIf="currentStep === 3" class="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-slate-100 animate-in slide-in-from-bottom-4 duration-500">
        <header class="mb-8">
          <h2 class="text-lg font-bold text-slate-900 leading-tight">Evidence Documentation</h2>
          <p class="text-slate-400 text-xs mt-1 uppercase tracking-widest font-bold">Step 3: Asset Protection</p>
        </header>
        
        <div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div *ngFor="let doc of docTypes" class="group relative">
            <input type="file" (change)="onFileSelect($event, doc.key)" class="hidden" #fileInput>
            <div (click)="fileInput.click()" 
                 [class]="'h-28 rounded-xl border transition-all flex flex-col items-center justify-center p-3 text-center cursor-pointer ' + 
                 (files[doc.key] ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100 hover:border-slate-300 hover:bg-white')">
               
               <div [class]="'w-8 h-8 rounded-lg flex items-center justify-center mb-2 ' + (files[doc.key] ? 'bg-emerald-500 text-white' : 'bg-white text-slate-300 border border-slate-100')">
                  <svg *ngIf="!files[doc.key]" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <svg *ngIf="files[doc.key]" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
               </div>
               
               <h4 class="text-[9px] font-bold uppercase tracking-wider text-slate-700 leading-tight">{{ doc.label }}</h4>
               <p class="text-[8px] text-slate-400 font-medium mt-1 truncate max-w-full">
                 {{ files[doc.key] ? 'Uploaded' : 'Required' }}
               </p>
            </div>
          </div>
        </div>

        <div class="mt-10 flex justify-between">
          <button (click)="prevStep()" class="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-6 py-2 hover:text-slate-900 transition-colors">Back</button>
          <button (click)="nextStep()" class="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">
            Final Review
          </button>
        </div>
      </div>

      <!-- Step 4: Review -->
      <div *ngIf="currentStep === 4" class="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-slate-100 animate-in slide-in-from-bottom-4 duration-500">
        <header class="mb-8">
          <h2 class="text-lg font-bold text-slate-900 leading-tight">Confirmation</h2>
          <p class="text-slate-400 text-xs mt-1 uppercase tracking-widest font-bold">Step 4: Execute Rental</p>
        </header>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div class="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">Operational Summary</p>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-[10px] font-bold text-slate-400 uppercase">Client</span>
                <span class="text-xs font-bold text-slate-900">{{ foundCustomer?.name }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-[10px] font-bold text-slate-400 uppercase">Vehicle</span>
                <span class="text-xs font-bold text-slate-900">{{ selectedVehicleModel }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-[10px] font-bold text-slate-400 uppercase">Duration</span>
                <span class="text-xs font-bold text-slate-900">{{ estimatedDays }} Operations Days</span>
              </div>
            </div>
          </div>

          <div class="p-6 bg-slate-900 rounded-2xl text-white shadow-xl shadow-slate-900/20 flex flex-col justify-center">
            <p class="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Estimated Total</p>
            <h3 class="text-3xl font-bold">LKR {{ estimatedPrice | number }}</h3>
            <p class="text-[9px] font-bold text-primary-400 uppercase mt-2 tracking-widest italic">Review terms before execution</p>
          </div>
        </div>

        <div class="flex justify-between items-center">
          <button (click)="prevStep()" class="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-6 py-2 hover:text-slate-900 transition-colors">Edit Data</button>
          <button (click)="onConfirm()" [disabled]="submitting" 
            class="bg-emerald-600 text-white px-10 py-3.5 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/10 min-w-[240px]">
            {{ submitting ? 'Executing...' : 'Execute Rental Contract' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class BookingsComponent implements OnInit {
  currentStep = 1;
  nicQuery = '';
  foundCustomer: Customer | null = null;
  availableVehicles: Vehicle[] = [];
  rentalForm: FormGroup;
  submitting = false;
  loadingVehicles = false;

  docTypes = [
    { key: 'selfie', label: 'Selfie' },
    { key: 'nic_front', label: 'NIC Front' },
    { key: 'nic_back', label: 'NIC Back' },
    { key: 'agreement', label: 'Agreement' },
    { key: 'item', label: 'Security Item' }
  ] as const;

  files: { 
    selfie: File | null, 
    nic_front: File | null, 
    nic_back: File | null, 
    agreement: File | null, 
    item: File | null 
  } = {
    selfie: null,
    nic_front: null,
    nic_back: null,
    agreement: null,
    item: null
  };

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) {
    this.rentalForm = this.fb.group({
      vehicle_id: ['', Validators.required],
      pickup_datetime: [new Date().toISOString().slice(0, 16), Validators.required],
      return_datetime: ['', Validators.required],
      buffer_hours: [1, Validators.required],
      pickup_km: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {}

  onNicSearch() {
    if (this.nicQuery.length === 10 || this.nicQuery.length === 12) {
      this.api.searchCustomer(this.nicQuery).subscribe({
        next: (res: any) => this.foundCustomer = res.data || res,
        error: () => this.foundCustomer = null
      });
    } else {
      this.foundCustomer = null;
    }
  }

  onDateChange() {
    const start = this.rentalForm.get('pickup_datetime')?.value;
    const end = this.rentalForm.get('return_datetime')?.value;
    const buffer = this.rentalForm.get('buffer_hours')?.value;

    if (start && end && new Date(end) > new Date(start)) {
      this.loadingVehicles = true;
      // Effective end time with buffer
      const bufferedEnd = new Date(new Date(end).getTime() + (buffer * 60 * 60 * 1000)).toISOString();
      
      this.api.getAvailableVehicles(start, bufferedEnd).subscribe({
        next: (res: any) => {
          this.availableVehicles = res.data || res;
          this.loadingVehicles = false;
        },
        error: () => this.loadingVehicles = false
      });
    }
  }

  onVehicleSelect() {
    const vehicleId = this.rentalForm.get('vehicle_id')?.value;
    const vehicle = this.availableVehicles.find(v => v.id == vehicleId);
    if (vehicle) {
      this.rentalForm.patchValue({
        pickup_km: vehicle.current_km
      });
    }
  }

  onFileSelect(event: any, type: keyof typeof this.files) {
    const file = event.target.files[0];
    if (file) this.files[type] = file;
  }

  nextStep() { this.currentStep++; }
  prevStep() { this.currentStep--; }

  get selectedVehicleModel() {
    const id = this.rentalForm.get('vehicle_id')?.value;
    return this.availableVehicles.find(v => v.id == id)?.model || 'Not Selected';
  }

  get selectedVehicleRate() {
    const id = this.rentalForm.get('vehicle_id')?.value;
    return this.availableVehicles.find(v => v.id == id)?.daily_rate || 0;
  }

  get estimatedHours() {
    const start = new Date(this.rentalForm.get('pickup_datetime')?.value);
    const end = new Date(this.rentalForm.get('return_datetime')?.value);
    if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60));
    return Math.max(1, diff);
  }

  get estimatedDays() {
    return Math.ceil(this.estimatedHours / 24);
  }

  get estimatedPrice() {
    return this.estimatedDays * this.selectedVehicleRate;
  }

  onConfirm() {
    this.submitting = true;
    const vehicleId = this.rentalForm.get('vehicle_id')?.value;
    const start = this.rentalForm.get('pickup_datetime')?.value;
    const end = this.rentalForm.get('return_datetime')?.value;
    const buffer = this.rentalForm.get('buffer_hours')?.value;
    const bufferedEnd = new Date(new Date(end).getTime() + (buffer * 60 * 60 * 1000)).toISOString();

    // Final Availability Verification
    this.api.getAvailableVehicles(start, bufferedEnd).subscribe({
      next: (res: any) => {
        const stillAvailable = (res.data || res).some((v: Vehicle) => v.id == vehicleId);
        if (!stillAvailable) {
          alert('Sorry, this vehicle just became unavailable for your selected time. Please select another vehicle.');
          this.currentStep = 2;
          this.submitting = false;
          return;
        }

        this.proceedToBooking();
      },
      error: () => {
        alert('Verification failed. Please try again.');
        this.submitting = false;
      }
    });
  }

  proceedToBooking() {
    const formData = new FormData();
    formData.append('customer_id', this.foundCustomer!.id.toString());
    formData.append('vehicle_id', this.rentalForm.get('vehicle_id')?.value);
    formData.append('pickup_datetime', this.rentalForm.get('pickup_datetime')?.value);
    formData.append('return_datetime', this.rentalForm.get('return_datetime')?.value);
    formData.append('pickup_km', this.rentalForm.get('pickup_km')?.value);
    formData.append('advance_payment', '0');

    Object.keys(this.files).forEach(key => {
      const file = this.files[key as keyof typeof this.files];
      if (file) formData.append(key, file);
    });

    this.api.createBooking(formData).subscribe({
      next: () => {
        alert('Booking Confirmed Successfully!');
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        alert('Error generating booking.');
        this.submitting = false;
      }
    });
  }
}
