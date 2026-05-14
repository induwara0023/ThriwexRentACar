import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-driver-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <!-- Header -->
      <header class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-bold text-slate-900 leading-tight">Driver Management</h1>
          <p class="text-slate-400 text-sm">Assign and manage your fleet drivers.</p>
        </div>
        <button (click)="openModal()" class="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-primary-500 transition-all flex items-center gap-2 shadow-xl shadow-primary-600/10">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
          Add New Driver
        </button>
      </header>

      <!-- Drivers Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let driver of drivers" class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all group">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-500 transition-all">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <div>
                <h3 class="font-bold text-slate-900 leading-tight">{{ driver.name }}</h3>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {{ driver.license_no }}</p>
              </div>
            </div>
            <span [class]="'px-2 py-1 rounded-md text-[8px] font-bold uppercase tracking-widest ' + 
              (driver.status === 'available' ? 'bg-emerald-50 text-emerald-600' : 
               driver.status === 'on_hire' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400')">
              {{ driver.status.replace('_', ' ') }}
            </span>
          </div>
          
          <div class="space-y-3 py-4 border-y border-slate-50 mb-4">
            <div class="flex items-center gap-3 text-slate-500">
              <svg class="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              <span class="text-xs font-medium">{{ driver.phone }}</span>
            </div>
            <div class="flex items-center gap-3 text-slate-500">
              <svg class="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span class="text-xs font-medium truncate">{{ driver.address || 'No address provided' }}</span>
            </div>
          </div>

          <div class="flex gap-2">
            <button (click)="openModal(driver)" class="flex-1 py-2 rounded-lg bg-slate-50 text-slate-600 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all">Edit Details</button>
            <button (click)="deleteDriver(driver.id)" class="px-3 py-2 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 transition-all">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </div>

        <div *ngIf="drivers.length === 0" class="col-span-full py-20 text-center bg-white rounded-2xl border-2 border-dashed border-slate-100">
          <p class="text-slate-400 font-medium italic">No drivers registered in the system yet.</p>
        </div>
      </div>

      <!-- Driver Modal -->
      <div *ngIf="isModalOpen" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in duration-200">
          <div class="p-6 border-b border-slate-50 flex justify-between items-center">
            <h2 class="text-lg font-bold text-slate-900">{{ editingDriver ? 'Edit' : 'Add' }} Driver</h2>
            <button (click)="closeModal()" class="text-slate-400 hover:text-slate-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          <form (submit)="saveDriver($event)" class="p-6 space-y-4">
            <div class="grid grid-cols-1 gap-4">
              <div>
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                <input type="text" name="name" [(ngModel)]="formData.name" required class="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all">
              </div>
              <div>
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">License No</label>
                <input type="text" name="license_no" [(ngModel)]="formData.license_no" required class="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all">
              </div>
              <div>
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Phone Number</label>
                <input type="text" name="phone" [(ngModel)]="formData.phone" required class="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all">
              </div>
              <div>
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Status</label>
                <select name="status" [(ngModel)]="formData.status" class="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all">
                  <option value="available">Available</option>
                  <option value="on_hire">On Hire</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Home Address</label>
                <textarea name="address" [(ngModel)]="formData.address" rows="2" class="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"></textarea>
              </div>
            </div>

            <div class="pt-4 flex gap-3">
              <button type="button" (click)="closeModal()" class="flex-1 px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] text-slate-500 hover:bg-slate-50 transition-all">Cancel</button>
              <button type="submit" class="flex-1 bg-primary-600 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-primary-500 transition-all shadow-lg shadow-primary-600/20">
                {{ editingDriver ? 'Update' : 'Register' }} Driver
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DriverManagementComponent implements OnInit {
  drivers: any[] = [];
  loading = false;
  isModalOpen = false;
  editingDriver: any = null;
  formData: any = {
    name: '',
    license_no: '',
    phone: '',
    address: '',
    status: 'available'
  };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadDrivers();
  }

  loadDrivers() {
    this.loading = true;
    this.api.getDrivers().subscribe({
      next: (res: any) => {
        this.drivers = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load drivers', err);
        this.loading = false;
      }
    });
  }

  openModal(driver: any = null) {
    this.editingDriver = driver;
    if (driver) {
      this.formData = { ...driver };
    } else {
      this.formData = {
        name: '',
        license_no: '',
        phone: '',
        address: '',
        status: 'available'
      };
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.editingDriver = null;
  }

  saveDriver(event: Event) {
    event.preventDefault();
    const action = this.editingDriver 
      ? this.api.updateDriver(this.editingDriver.id, this.formData)
      : this.api.saveDriver(this.formData);

    action.subscribe({
      next: () => {
        this.loadDrivers();
        this.closeModal();
      },
      error: (err) => {
        alert(err.error?.message || 'Failed to save driver');
      }
    });
  }

  deleteDriver(id: number) {
    if (confirm('Are you sure you want to delete this driver?')) {
      this.api.deleteDriver(id).subscribe({
        next: () => this.loadDrivers(),
        error: (err) => alert(err.error?.message || 'Failed to delete driver')
      });
    }
  }
}
