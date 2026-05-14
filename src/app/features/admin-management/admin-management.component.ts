import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-admin-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <!-- Header -->
      <header class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-bold text-slate-900 leading-tight">Admin Management</h1>
          <p class="text-slate-400 text-sm">Create and manage system administrators.</p>
        </div>
        <button (click)="openModal()" class="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all flex items-center gap-2 shadow-xl shadow-slate-900/10">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
          Add New Admin
        </button>
      </header>

      <!-- Admin List -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                <th class="px-6 py-4">Name</th>
                <th class="px-6 py-4">Email</th>
                <th class="px-6 py-4">Created At</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr *ngFor="let admin of admins" class="hover:bg-slate-50/50 transition-colors">
                <td class="px-6 py-4 font-semibold text-slate-700 text-sm">{{ admin.name }}</td>
                <td class="px-6 py-4 text-slate-500 text-sm">{{ admin.email }}</td>
                <td class="px-6 py-4 text-slate-400 text-xs">{{ admin.created_at | date:'mediumDate' }}</td>
                <td class="px-6 py-4 text-right space-x-2">
                  <button (click)="openModal(admin)" class="text-slate-400 hover:text-blue-500 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button (click)="deleteAdmin(admin.id)" class="text-slate-400 hover:text-red-500 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </td>
              </tr>
              <tr *ngIf="admins.length === 0 && !loading">
                <td colspan="4" class="px-6 py-12 text-center text-slate-400 italic text-sm">No administrators found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Admin Modal -->
      <div *ngIf="isModalOpen" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in duration-200">
          <div class="p-6 border-b border-slate-50 flex justify-between items-center">
            <h2 class="text-lg font-bold text-slate-900">{{ editingAdmin ? 'Edit' : 'Add' }} Admin</h2>
            <button (click)="closeModal()" class="text-slate-400 hover:text-slate-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          <form (submit)="saveAdmin($event)" class="p-6 space-y-4">
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
              <input type="text" name="name" [(ngModel)]="formData.name" required class="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-slate-900 outline-none transition-all">
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
              <input type="email" name="email" [(ngModel)]="formData.email" required class="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-slate-900 outline-none transition-all">
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Password {{ editingAdmin ? '(Leave blank to keep current)' : '' }}</label>
              <input type="password" name="password" [(ngModel)]="formData.password" [required]="!editingAdmin" class="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-slate-900 outline-none transition-all">
            </div>

            <div class="pt-4 flex gap-3">
              <button type="button" (click)="closeModal()" class="flex-1 px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] text-slate-500 hover:bg-slate-50 transition-all">Cancel</button>
              <button type="submit" class="flex-1 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20">
                {{ editingAdmin ? 'Update' : 'Create' }} Admin
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AdminManagementComponent implements OnInit {
  admins: any[] = [];
  loading = false;
  isModalOpen = false;
  editingAdmin: any = null;
  formData: any = {
    name: '',
    email: '',
    password: ''
  };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadAdmins();
  }

  loadAdmins() {
    this.loading = true;
    this.api.getAdmins().subscribe({
      next: (res: any) => {
        this.admins = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load admins', err);
        this.loading = false;
      }
    });
  }

  openModal(admin: any = null) {
    this.editingAdmin = admin;
    if (admin) {
      this.formData = {
        name: admin.name,
        email: admin.email,
        password: ''
      };
    } else {
      this.formData = {
        name: '',
        email: '',
        password: ''
      };
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.editingAdmin = null;
  }

  saveAdmin(event: Event) {
    event.preventDefault();
    const action = this.editingAdmin 
      ? this.api.updateAdmin(this.editingAdmin.id, this.formData)
      : this.api.createAdmin(this.formData);

    action.subscribe({
      next: () => {
        this.loadAdmins();
        this.closeModal();
      },
      error: (err) => {
        alert(err.error?.message || 'Failed to save admin');
      }
    });
  }

  deleteAdmin(id: number) {
    if (confirm('Are you sure you want to delete this administrator?')) {
      this.api.deleteAdmin(id).subscribe({
        next: () => this.loadAdmins(),
        error: (err) => alert(err.error?.message || 'Failed to delete admin')
      });
    }
  }
}
