import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { LucideAngularModule, Search, User, Phone, MapPin, FileText, Calendar, Car, ShieldCheck, ChevronRight, X, Image as ImageIcon, Download, FileDigit } from 'lucide-angular';

@Component({
  selector: 'app-customer-history',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="max-w-7xl mx-auto space-y-4 md:space-y-6 animate-in fade-in duration-500">
      <!-- Sleek Search Header -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div class="w-full md:w-auto">
          <h1 class="text-xl font-bold text-slate-900 leading-tight">Customer Intelligence</h1>
          <p class="text-slate-400 text-sm">Verify credentials and manage legal agreements.</p>
        </div>
        
        <div class="flex items-center bg-slate-50 rounded-xl p-1.5 border border-slate-200 w-full max-w-md focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
          <lucide-icon [img]="Search" class="ml-3 text-slate-400 w-4 h-4"></lucide-icon>
          <input 
            type="text" 
            [(ngModel)]="searchNic"
            (keyup.enter)="search()"
            placeholder="Search NIC..."
            class="flex-grow bg-transparent border-none py-2 px-3 text-sm font-medium focus:ring-0 placeholder:text-slate-300 text-slate-700"
          >
          <button 
            (click)="search()"
            [disabled]="loading"
            class="bg-slate-900 text-white px-5 py-2 rounded-lg font-semibold text-xs transition-all hover:bg-slate-800 disabled:opacity-50"
          >
            {{ loading ? 'Searching...' : 'Search' }}
          </button>
        </div>
      </div>

      <!-- Result View -->
      <div *ngIf="customer" class="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in slide-in-from-bottom-4 duration-500">
        
        <!-- Left: Profile Info -->
        <div class="lg:col-span-1 space-y-4 md:space-y-6">
          <div class="bg-white rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-slate-100">
            <div class="flex flex-col items-center text-center mb-6">
              <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 border border-slate-100 mb-3">
                <lucide-icon [img]="User" class="w-8 h-8"></lucide-icon>
              </div>
              <h2 class="text-lg font-bold text-slate-900">{{ customer.name }}</h2>
              <span class="mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider"
                [ngClass]="customer.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'">
                {{ customer.status }}
              </span>
            </div>

            <div class="space-y-4 pt-4 border-t border-slate-50">
              <div class="flex items-start gap-3">
                <lucide-icon [img]="FileText" class="w-4 h-4 text-slate-400 mt-0.5"></lucide-icon>
                <div class="overflow-hidden">
                  <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">NIC Number</p>
                  <p class="text-slate-700 text-xs font-medium truncate">{{ customer.nic_no }}</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <lucide-icon [img]="Phone" class="w-4 h-4 text-slate-400 mt-0.5"></lucide-icon>
                <div>
                  <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Phone</p>
                  <p class="text-slate-700 text-xs font-medium">{{ customer.phone }}</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <lucide-icon [img]="MapPin" class="w-4 h-4 text-slate-400 mt-0.5"></lucide-icon>
                <div>
                  <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Address</p>
                  <p class="text-slate-700 text-xs font-medium leading-relaxed">{{ customer.address }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Documents Grid (Compact) -->
          <div class="bg-white rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-slate-100">
            <h3 class="text-xs font-bold text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-wider">
              Verification Docs
            </h3>
            <div class="grid grid-cols-2 gap-3">
              <div *ngFor="let img of [ {u: customer.nic_front, t: 'NIC Front'}, {u: customer.nic_back, t: 'NIC Back'}, {u: customer.license_front, t: 'License F'}, {u: customer.license_back, t: 'License B'}]" 
                class="aspect-video bg-slate-50 rounded-lg overflow-hidden border border-slate-100 cursor-pointer hover:border-primary-500 transition-colors group"
                (click)="openImage(img.u)">
                <img *ngIf="img.u" [src]="img.u" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity">
                <div *ngIf="!img.u" class="w-full h-full flex items-center justify-center text-[10px] text-slate-300 font-bold uppercase">{{ img.t }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Activity Timeline -->
        <div class="lg:col-span-3">
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 h-full overflow-hidden flex flex-col">
            <div class="p-4 sm:p-5 md:p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wider">
                <lucide-icon [img]="Calendar" class="w-4 h-4 text-slate-400"></lucide-icon>
                Rental History
              </h3>
              <span class="text-[10px] font-bold text-slate-400 bg-white px-2 py-1 rounded border border-slate-100">{{ customer.rental_history?.length || 0 }} Records Found</span>
            </div>

            <div class="flex-grow p-4 sm:p-5 md:p-6">
              <div class="overflow-x-auto">
                <table class="w-full text-left">
                  <thead>
                    <tr class="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      <th class="pb-4 font-bold">Vehicle</th>
                      <th class="pb-4 font-bold">Duration</th>
                      <th class="pb-4 font-bold">Status</th>
                      <th class="pb-4 font-bold text-right">Amount</th>
                      <th class="pb-4"></th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-50">
                    <tr *ngFor="let booking of customer.rental_history" 
                      (click)="selectedBooking = booking"
                      class="group hover:bg-slate-50/80 transition-colors cursor-pointer">
                      <td class="py-4">
                        <div class="flex items-center gap-3">
                          <div class="w-10 h-10 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center shadow-sm overflow-hidden">
                            <img *ngIf="booking.vehicle?.image_url" [src]="booking.vehicle?.image_url" class="w-full h-full object-cover">
                            <lucide-icon *ngIf="!booking.vehicle?.image_url" [img]="Car" class="w-4 h-4 text-slate-300"></lucide-icon>
                          </div>
                          <div>
                            <p class="text-xs font-bold text-slate-800">{{ booking.vehicle?.model }}</p>
                            <p class="text-[10px] text-slate-400">{{ booking.vehicle?.plate_no }}</p>
                          </div>
                        </div>
                      </td>
                      <td class="py-4">
                        <p class="text-xs font-medium text-slate-600">{{ booking.pickup_datetime | date:'MMM d' }} - {{ booking.return_datetime | date:'MMM d' }}</p>
                        <p class="text-[10px] text-slate-400">{{ booking.pickup_datetime | date:'shortTime' }}</p>
                      </td>
                      <td class="py-4">
                        <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                          [ngClass]="booking.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-primary-50 text-primary-600'">
                          {{ booking.status }}
                        </span>
                      </td>
                      <td class="py-4 text-right">
                        <p class="text-xs font-bold text-slate-900">Rs. {{ (booking.total_price || 0) | number }}</p>
                      </td>
                      <td class="py-4 text-right">
                        <lucide-icon [img]="ChevronRight" class="w-4 h-4 text-slate-200 group-hover:text-primary-500 transition-colors"></lucide-icon>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div *ngIf="customer.rental_history?.length === 0" class="text-center py-20">
                <p class="text-slate-300 text-xs font-medium italic">No historical records found.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Compact Drawer -->
      <div *ngIf="selectedBooking" class="fixed inset-0 z-[200] flex justify-end animate-fade-in">
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" (click)="selectedBooking = null"></div>
        <div class="bg-white w-full max-w-lg h-full shadow-2xl relative z-10 overflow-y-auto animate-slide-in-right border-l border-slate-100 flex flex-col">
          <div class="p-4 sm:p-6 border-b border-slate-50 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-20">
            <div>
              <h3 class="text-sm font-bold text-slate-900">Booking Details</h3>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Reference #{{ selectedBooking.id }}</p>
            </div>
            <button (click)="selectedBooking = null" class="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
              <lucide-icon [img]="X" class="w-4 h-4"></lucide-icon>
            </button>
          </div>

          <div class="p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8 flex-grow">
            <!-- Header Info -->
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden border border-slate-100 shadow-sm flex-shrink-0">
                <img *ngIf="selectedBooking.vehicle?.image_url" [src]="selectedBooking.vehicle?.image_url" class="w-full h-full object-cover">
                <lucide-icon *ngIf="!selectedBooking.vehicle?.image_url" [img]="Car" class="w-6 h-6 text-slate-300"></lucide-icon>
              </div>
              <div>
                <h4 class="text-lg font-bold text-slate-900 leading-tight">{{ selectedBooking.vehicle?.model }}</h4>
                <p class="text-xs text-slate-500 font-medium">{{ selectedBooking.vehicle?.plate_no }} • {{ selectedBooking.vehicle?.transmission }}</p>
                <div class="mt-1 flex items-center gap-2">
                  <span class="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 uppercase tracking-widest">{{ selectedBooking.status }}</span>
                </div>
              </div>
            </div>

            <!-- Documents -->
            <section>
              <h5 class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Evidence & Agreement ({{ selectedBooking.media?.length || 0 }} Items)</h5>
              <div class="grid grid-cols-2 gap-3">
                <div *ngFor="let doc of selectedBooking.media" class="group relative bg-slate-50 rounded-xl overflow-hidden border border-slate-100 hover:border-primary-500 transition-all">
                  <div class="aspect-video relative">
                    <img [src]="doc.file_url" class="w-full h-full object-cover">
                    <div class="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button (click)="openImage(doc.file_url)" class="p-2 bg-white rounded-lg text-slate-900 hover:bg-primary-600 hover:text-white transition-all">
                        <lucide-icon [img]="ImageIcon" class="w-4 h-4"></lucide-icon>
                      </button>
                      <button (click)="downloadDoc(doc)" class="p-2 bg-white rounded-lg text-slate-900 hover:bg-primary-600 hover:text-white transition-all">
                        <lucide-icon [img]="Download" class="w-4 h-4"></lucide-icon>
                      </button>
                    </div>
                  </div>
                  <div class="p-3 flex items-center justify-between bg-white">
                    <p class="text-[10px] font-bold text-slate-700 capitalize">{{ doc.type.replace('_', ' ') }}</p>
                    <lucide-icon [img]="ShieldCheck" class="w-3 h-3 text-emerald-500"></lucide-icon>
                  </div>
                </div>
                
                <div *ngIf="!selectedBooking.media?.length" class="col-span-2 py-10 text-center border-2 border-dashed border-slate-100 rounded-xl">
                  <p class="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No documents attached</p>
                </div>
              </div>
            </section>

            <!-- Metrics -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="bg-slate-50 p-4 rounded-xl">
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Fee</p>
                <p class="text-sm font-bold text-slate-900">LKR {{ selectedBooking.total_price | number }}</p>
              </div>
              <div class="bg-slate-50 p-4 rounded-xl">
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Mileage</p>
                <p class="text-sm font-bold text-slate-900">{{ selectedBooking.pickup_km }} - {{ selectedBooking.return_km || '...' }} KM</p>
              </div>
            </div>
          </div>
          
          <div class="p-6 bg-slate-50 border-t border-slate-100">
             <button (click)="selectedBooking = null" class="w-full bg-slate-900 text-white py-3 rounded-xl text-xs font-bold transition-all hover:bg-slate-800">
                Close Details
             </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!customer && !loading && !error" class="bg-white rounded-2xl p-20 text-center border border-slate-100">
        <lucide-icon [img]="Search" class="w-10 h-10 text-slate-200 mx-auto mb-4"></lucide-icon>
        <h3 class="text-lg font-bold text-slate-900 mb-1">Search Customer</h3>
        <p class="text-slate-400 text-sm max-w-xs mx-auto">Enter an NIC number to view historical records and legal evidence.</p>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; }
    .animate-slide-in-right { animation: slideRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    @keyframes slideRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class CustomerHistoryComponent implements OnInit {
  readonly Search = Search;
  readonly User = User;
  readonly Phone = Phone;
  readonly MapPin = MapPin;
  readonly FileText = FileText;
  readonly Calendar = Calendar;
  readonly Car = Car;
  readonly ShieldCheck = ShieldCheck;
  readonly ChevronRight = ChevronRight;
  readonly X = X;
  readonly ImageIcon = ImageIcon;
  readonly Download = Download;
  readonly FileDigit = FileDigit;

  searchNic: string = '';
  customer: any = null;
  loading: boolean = false;
  error: string | null = null;
  selectedBooking: any = null;

  constructor(private api: ApiService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['nic']) {
        this.searchNic = params['nic'];
        this.search();
      }
    });
  }

  search() {
    if (!this.searchNic) return;

    this.loading = true;
    this.error = null;
    this.customer = null;

    this.api.searchCustomer(this.searchNic).subscribe({
      next: (res) => {
        this.customer = res.data || res;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Customer not found or error occurred.';
        this.loading = false;
      }
    });
  }

  openImage(url: string | null) {
    if (url) {
      window.open(url, '_blank');
    }
  }

  getDocUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `http://localhost:8000/api/media/${path}`;
    // return `https://api.nsrentacarmanager.online/api/media/${path}`;
  }

  downloadDoc(doc: any) {
    const url = doc.file_url;
    const link = document.createElement('a');
    link.href = url;
    link.download = `${this.customer.name}_${doc.type}_${doc.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
