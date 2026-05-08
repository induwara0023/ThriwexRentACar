import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vehicle-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="p-4 max-w-4xl mx-auto animate-fade-in bg-slate-50 min-h-screen">
      <header class="mb-12 flex items-center justify-between">
        <div>
          <h1 class="text-4xl font-black text-slate-800 tracking-tight">{{ isEdit ? 'Edit Vehicle' : 'Register New Vehicle' }}</h1>
          <p class="text-slate-500 font-medium mt-2">{{ isEdit ? 'Modify the details of your existing asset.' : 'Add a new asset to your rental inventory.' }}</p>
        </div>
        <button (click)="goBack()" class="px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-500 font-bold hover:bg-white transition-all flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Inventory
        </button>
      </header>

      <form [formGroup]="vehicleForm" (ngSubmit)="onSubmit()" class="space-y-8">
        <!-- Section 1: Basic Information -->
        <div class="glass-card p-6 rounded-2xl">
          <h2 class="text-[10px] font-black text-primary-500 uppercase tracking-[0.2em] mb-6">Basic Identification</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div class="space-y-2">
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Plate Number</label>
              <input type="text" formControlName="plate_no" class="enterprise-input" placeholder="e.g. CAB-1234">
            </div>
            <div class="space-y-2">
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Model Name</label>
              <input type="text" formControlName="model" class="enterprise-input">
            </div>
            <div class="space-y-2">
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vehicle Type</label>
              <select formControlName="type" class="enterprise-input bg-white appearance-none">
                <option value="Car">Car</option>
                <option value="Van">Van</option>
                <option value="SUV">SUV</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div class="space-y-2">
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Transmission</label>
              <div class="flex gap-4 p-2 bg-slate-50 rounded-2xl border-2 border-slate-50">
                <label class="flex-1 cursor-pointer">
                  <input type="radio" formControlName="transmission" value="Auto" class="hidden peer">
                  <div class="text-center py-3 rounded-xl font-black text-xs uppercase peer-checked:bg-white peer-checked:shadow-sm peer-checked:text-primary-600 transition-all text-slate-400">Auto</div>
                </label>
                <label class="flex-1 cursor-pointer">
                  <input type="radio" formControlName="transmission" value="Manual" class="hidden peer">
                  <div class="text-center py-3 rounded-xl font-black text-xs uppercase peer-checked:bg-white peer-checked:shadow-sm peer-checked:text-primary-600 transition-all text-slate-400">Manual</div>
                </label>
              </div>
            </div>
            <div class="space-y-2">
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Daily Rate (LKR)</label>
              <input type="number" formControlName="daily_rate" class="enterprise-input">
            </div>
          </div>
        </div>

        <!-- Section 2: Pricing & KM Logic -->
        <div class="glass-card p-6 rounded-2xl border-2 border-primary-100 bg-primary-50/10">
          <h2 class="text-[10px] font-black text-primary-600 uppercase tracking-[0.2em] mb-6">Mileage & Excess Charges</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-2">
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">KM Limit Per Day</label>
              <div class="relative">
                <input type="number" formControlName="km_limit_per_day" class="enterprise-input !pr-16">
                <span class="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase">KM</span>
              </div>
            </div>
            <div class="space-y-2">
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Extra KM Rate (LKR)</label>
              <div class="relative">
                <input type="number" formControlName="extra_km_rate" class="enterprise-input !pr-16">
                <span class="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase">Per KM</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 3: Technical & Maintenance -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="glass-card p-8 rounded-3xl">
            <h2 class="text-xs font-black text-primary-500 uppercase tracking-[0.2em] mb-6">Maintenance Stats</h2>
            <div class="space-y-4">
              <div class="space-y-2">
                <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Mileage (KM)</label>
                <input type="number" formControlName="current_km" class="enterprise-input">
              </div>
              <div class="space-y-2">
                <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Next Service (KM)</label>
                <input type="number" formControlName="next_service_km" class="enterprise-input">
              </div>
            </div>
          </div>

          <div class="glass-card p-8 rounded-3xl">
            <h2 class="text-xs font-black text-rose-500 uppercase tracking-[0.2em] mb-6">Legal & Expiry</h2>
            <div class="space-y-4">
              <div class="space-y-2">
                <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Insurance Expiry</label>
                <input type="date" formControlName="insurance_expiry" class="enterprise-input">
              </div>
              <div class="space-y-2">
                <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Revenue License Expiry</label>
                <input type="date" formControlName="license_expiry" class="enterprise-input">
              </div>
            </div>
          </div>
        </div>

        <!-- Section 4: Document Uploads -->
        <div class="glass-card p-6 rounded-2xl">
          <h2 class="text-[10px] font-black text-primary-500 uppercase tracking-[0.2em] mb-4">Document Digitalization</h2>
          <div class="upload-zone" (click)="fileInput.click()">
            <input type="file" (change)="onFileSelect($event, 'image')" class="hidden" #fileInput>
            <div class="text-center">
              <div class="w-8 h-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <p class="text-[9px] font-black text-slate-800 uppercase tracking-widest">Vehicle Photo</p>
              <p class="text-[8px] text-slate-400 font-bold mt-1">{{ files.image?.name || (isEdit ? 'Keep Existing' : 'Click to upload') }}</p>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4">
          <button type="button" (click)="goBack()" class="px-6 py-3 rounded-lg font-black uppercase tracking-widest text-[9px] text-slate-500 border-2 border-slate-100 hover:bg-slate-50 transition-all">Cancel</button>
          <button type="submit" [disabled]="vehicleForm.invalid || submitting" class="bg-slate-900 text-white px-10 py-3 rounded-lg font-black uppercase tracking-widest text-[9px] shadow-2xl shadow-slate-900/20 hover:bg-primary-600 transition-all disabled:opacity-30">
            {{ submitting ? 'Processing...' : (isEdit ? 'Update Vehicle' : 'Complete Registration') }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .enterprise-input {
      @apply w-full px-3 py-2 rounded-lg border-2 border-slate-100 bg-slate-50 text-slate-800 font-bold outline-none focus:bg-white focus:border-primary-500 transition-all text-xs;
    }
    .upload-zone {
      @apply h-24 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center cursor-pointer hover:border-primary-500 transition-all bg-slate-50;
    }
  `]
})
export class VehicleRegistrationComponent implements OnInit {
  vehicleForm: FormGroup;
  submitting = false;
  isEdit = false;
  vehicleId: number | null = null;
  files: { image: File | null } = { image: null };

  constructor(
    private fb: FormBuilder, 
    private api: ApiService, 
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.vehicleForm = this.fb.group({
      plate_no: ['', [Validators.required]],
      model: ['', Validators.required],
      type: ['Car', Validators.required],
      transmission: ['Auto', Validators.required],
      current_km: [0, Validators.required],
      next_service_km: [0, Validators.required],
      insurance_expiry: ['', Validators.required],
      license_expiry: ['', Validators.required],
      daily_rate: [0, Validators.required],
      km_limit_per_day: [0, Validators.required],
      extra_km_rate: [0, Validators.required],
      status: ['available']
    });
  }

  ngOnInit() {
    this.vehicleId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.vehicleId) {
      this.isEdit = true;
      this.loadVehicle();
    }
  }

  loadVehicle() {
    this.api.getVehicles().subscribe((res: any) => {
      const vehicles = res.data || res;
      const vehicle = vehicles.find((v: any) => v.id === this.vehicleId);
      if (vehicle) {
        this.vehicleForm.patchValue({
          ...vehicle,
          insurance_expiry: vehicle.insurance_expiry ? new Date(vehicle.insurance_expiry).toISOString().split('T')[0] : '',
          license_expiry: vehicle.license_expiry ? new Date(vehicle.license_expiry).toISOString().split('T')[0] : ''
        });
      }
    });
  }

  get f() { return this.vehicleForm.controls; }

  onFileSelect(event: any, type: 'image') {
    const file = event.target.files[0];
    if (file) this.files[type] = file;
  }

  onSubmit() {
    if (this.vehicleForm.invalid) return;
    this.submitting = true;
    const formData = new FormData();
    Object.keys(this.vehicleForm.value).forEach(key => {
      formData.append(key, this.vehicleForm.value[key]);
    });
    if (this.files.image) formData.append('image', this.files.image);

    const request = this.isEdit 
      ? this.api.updateVehicle(this.vehicleId!, formData)
      : this.api.registerVehicle(formData);

    request.subscribe({
      next: () => {
        alert(this.isEdit ? 'Vehicle Updated Successfully!' : 'Vehicle Registered Successfully!');
        this.router.navigate(['/fleet']);
      },
      error: () => {
        alert('Operation failed.');
        this.submitting = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/fleet']);
  }
}
