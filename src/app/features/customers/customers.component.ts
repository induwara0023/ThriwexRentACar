import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Customer } from '../../core/models/api.models';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <!-- Header -->
      <header class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between gap-6">
        <div>
          <h1 class="text-xl font-bold text-slate-900 leading-tight">Client Directory</h1>
          <p class="text-slate-400 text-sm">Manage your client database and trust profiles.</p>
        </div>

        <button (click)="openCreateModal()" class="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all flex items-center gap-2 shadow-xl shadow-slate-900/10">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
          New Client
        </button>
      </header>

      <!-- Customer List -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
        <div class="p-4 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
           <h2 class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Database Records</h2>
           <span class="text-[10px] font-bold text-slate-400 bg-white px-2 py-1 rounded border border-slate-100">{{ customers.length }} Active Profiles</span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                <th class="px-6 py-4">Client</th>
                <th class="px-6 py-4">Contact</th>
                <th class="px-6 py-4">Status</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr *ngFor="let customer of customers" class="hover:bg-slate-50 transition-colors group">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center font-bold text-xs group-hover:bg-primary-50 group-hover:text-primary-600 transition-all uppercase border border-slate-100">
                      {{ customer.name.charAt(0) }}
                    </div>
                    <div>
                      <p class="font-bold text-slate-800 text-xs">{{ customer.name }}</p>
                      <p class="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{{ customer.nic_no }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <p class="text-xs font-semibold text-slate-600">{{ customer.phone }}</p>
                  <p class="text-[10px] text-slate-400 truncate max-w-[150px]">{{ customer.address }}</p>
                </td>
                <td class="px-6 py-4">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                    [ngClass]="customer.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'">
                    {{ customer.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right flex items-center justify-end gap-2">
                  <button (click)="openEditModal(customer)" class="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all" title="Edit Profile">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button (click)="deleteCustomer(customer.id)" class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete Profile">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                  <button [routerLink]="['/customers/history']" [queryParams]="{ nic: customer.nic_no }" class="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-primary-600 transition-colors uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                    Intelligence
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
                  </button>
                </td>
              </tr>
              <tr *ngIf="customers.length === 0">
                <td colspan="4" class="px-8 py-20 text-center text-slate-300 text-xs font-medium italic">No client records found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Registration Modal -->
      <div *ngIf="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" (click)="showModal = false"></div>
        <div class="bg-white w-full max-w-lg rounded-2xl shadow-2xl relative z-10 overflow-hidden animate-zoom-in border border-slate-100">
          <header class="p-5 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
            <div>
              <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider">{{ editMode ? 'Update Client Profile' : 'Onboard New Client' }}</h2>
              <p class="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Customer Trust Profile</p>
            </div>
            <button (click)="showModal = false" class="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </header>

          <form [formGroup]="customerForm" (ngSubmit)="onSubmit()" class="p-6 space-y-5">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input type="text" formControlName="name" class="enterprise-input" placeholder="John Doe">
              </div>
              <div class="space-y-1.5">
                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">NIC Number</label>
                <input type="text" formControlName="nic_no" class="enterprise-input" placeholder="1995...">
              </div>
              <div class="space-y-1.5">
                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                <input type="text" formControlName="phone" class="enterprise-input" placeholder="+94...">
              </div>
              <div class="space-y-1.5">
                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Account Status</label>
                <select formControlName="status" class="enterprise-input appearance-none">
                  <option value="active">Active (Trusted)</option>
                  <option value="blacklisted">Blocked (Risk)</option>
                </select>
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Residential Address</label>
              <input type="text" formControlName="address" class="enterprise-input" placeholder="Enter full address...">
            </div>

            <div class="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
              <div class="space-y-1.5">
                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">NIC Front</label>
                <input type="file" (change)="onFileChange($event, 'nic_front')" class="block w-full text-[10px] text-slate-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-slate-900 file:text-white hover:file:bg-slate-800 transition-all">
              </div>
              <div class="space-y-1.5">
                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">NIC Back</label>
                <input type="file" (change)="onFileChange($event, 'nic_back')" class="block w-full text-[10px] text-slate-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-slate-900 file:text-white hover:file:bg-slate-800 transition-all">
              </div>
            </div>

            <div class="pt-2">
              <button type="submit" [disabled]="customerForm.invalid || submitting" class="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-primary-600 transition-all shadow-xl shadow-slate-900/10">
                {{ submitting ? (editMode ? 'Updating...' : 'Onboarding...') : (editMode ? 'Update Profile' : 'Register Client Profile') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  showModal = false;
  submitting = false;
  editMode = false;
  selectedCustomerId: number | null = null;
  customerForm: FormGroup;

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      nic_no: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      status: ['active', Validators.required],
      nic_front: [null],
      nic_back: [null]
    });
  }

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.api.getCustomers().subscribe((res: any) => {
      this.customers = res.data || res;
    });
  }

  onFileChange(event: any, field: string) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.customerForm.patchValue({ [field]: file });
    }
  }

  onSubmit() {
    if (this.customerForm.invalid) return;

    this.submitting = true;
    const formData = new FormData();
    Object.keys(this.customerForm.controls).forEach(key => {
      const value = this.customerForm.get(key)?.value;
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    const request = this.editMode && this.selectedCustomerId 
      ? this.api.updateCustomer(this.selectedCustomerId, formData)
      : this.api.createCustomer(formData);

    request.subscribe({
      next: () => {
        alert(this.editMode ? 'Customer Updated Successfully!' : 'Customer Registered Successfully!');
        this.showModal = false;
        this.customerForm.reset({ status: 'active' });
        this.loadCustomers();
        this.submitting = false;
      },
      error: (err) => {
        console.error(err);
        if (err.status === 422 && err.error?.errors) {
          const errors = err.error.errors;
          const messages = Object.values(errors).flat().join('\n');
          alert('Validation Errors:\n' + messages);
        } else {
          const message = err.error?.message || 'Registration failed. Check your data.';
          alert(message);
        }
        this.submitting = false;
      }
    });
  }

  openCreateModal() {
    this.editMode = false;
    this.selectedCustomerId = null;
    this.customerForm.reset({ status: 'active' });
    this.showModal = true;
  }

  openEditModal(customer: Customer) {
    this.editMode = true;
    this.selectedCustomerId = customer.id;
    this.customerForm.patchValue({
      name: customer.name,
      nic_no: customer.nic_no,
      phone: customer.phone,
      address: customer.address,
      status: customer.status
    });
    this.showModal = true;
  }

  deleteCustomer(id: number) {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.api.deleteCustomer(id).subscribe({
        next: () => {
          alert('Customer deleted successfully!');
          this.loadCustomers();
        },
        error: (err) => {
          console.error(err);
          alert('Failed to delete customer.');
        }
      });
    }
  }
}
