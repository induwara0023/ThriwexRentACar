import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- SCREEN VIEW (HIDDEN ON PRINT) -->
    <div class="p-6 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500 print:hidden">
      
      <!-- ================= FINANCIAL REPORTS SECTION ================= -->
      <section>
        <!-- Header -->
        <header class="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 mb-6">
          <div>
            <h1 class="text-xl font-bold text-slate-900 leading-tight">Financial Reports</h1>
            <p class="text-slate-400 text-sm">Analyze revenue streams and performance.</p>
          </div>
          
          <div class="w-full md:w-auto">
            <button (click)="downloadReport('financial')" class="w-full md:w-auto bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
              Print Financial Report
            </button>
          </div>
        </header>

        <!-- Filter Bar -->
        <div class="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-slate-100 flex flex-col lg:flex-row items-end gap-4 mb-6">
           <div class="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                 <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Asset Filter</label>
                 <select [(ngModel)]="selectedVehicleId" class="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm text-slate-700 font-medium focus:ring-2 focus:ring-primary-500 outline-none transition-all hover:bg-slate-100">
                   <option [ngValue]="null">All Vehicles</option>
                   <option *ngFor="let v of vehicles" [ngValue]="v.id">{{ v.model }} ({{ v.plate_no }})</option>
                 </select>
              </div>
              <div>
                 <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Start Date</label>
                 <input type="date" [(ngModel)]="startDate" class="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm text-slate-700 font-medium focus:ring-2 focus:ring-primary-500 outline-none transition-all hover:bg-slate-100">
              </div>
              <div>
                 <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">End Date</label>
                 <input type="date" [(ngModel)]="endDate" class="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm text-slate-700 font-medium focus:ring-2 focus:ring-primary-500 outline-none transition-all hover:bg-slate-100">
              </div>
           </div>
           <div class="w-full lg:w-auto mt-2 lg:mt-0">
              <button (click)="loadReport()" class="w-full bg-primary-600 text-white px-8 py-2.5 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-primary-500 transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary-600/20 h-[42px]">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                Apply Filter
              </button>
           </div>
        </div>

        <div *ngIf="loading" class="flex justify-center py-10">
          <div class="w-8 h-8 border-4 border-slate-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>

        <div *ngIf="!loading && reportData" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-center items-center text-center">
              <div class="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 mb-4">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Revenue</p>
              <h2 class="text-3xl font-bold text-slate-900">LKR {{ reportData.total_income | number:'1.2-2' }}</h2>
            </div>
            
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-center items-center text-center">
              <div class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 mb-4">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Months</p>
              <h2 class="text-3xl font-bold text-slate-900">{{ reportData.monthly_income?.length || 0 }}</h2>
            </div>

            <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-center items-center text-center">
              <div class="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500 mb-4">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17zm8-4h.01M15 13h.01M9 13h.01M15 9h.01M9 9h.01M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              </div>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Top Earning Vehicle</p>
              <h2 class="text-xl font-bold text-slate-900 mt-2 truncate w-full px-4">{{ getTopVehicleName() || 'N/A' }}</h2>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
              <div class="p-5 border-b border-slate-50 bg-slate-50/50">
                 <h2 class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Revenue by Vehicle</h2>
              </div>
              <div class="overflow-x-auto max-h-[400px] styled-scroll">
                <table class="w-full text-left">
                  <thead>
                    <tr class="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 sticky top-0 bg-white">
                      <th class="px-6 py-4">Vehicle</th>
                      <th class="px-6 py-4 text-right">Revenue (LKR)</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-50">
                    <tr *ngFor="let v of reportData.vehicle_income" class="hover:bg-slate-50 transition-colors">
                      <td class="px-6 py-4 font-bold text-slate-800 text-xs">{{ v.vehicle }}</td>
                      <td class="px-6 py-4 text-right font-bold text-emerald-600">{{ v.earned | number:'1.2-2' }}</td>
                    </tr>
                    <tr *ngIf="!reportData.vehicle_income?.length">
                      <td colspan="2" class="px-6 py-8 text-center text-slate-400 text-xs">No vehicle revenue data found.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
              <div class="p-5 border-b border-slate-50 bg-slate-50/50">
                 <h2 class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monthly Revenue Trend</h2>
              </div>
              <div class="overflow-x-auto max-h-[400px]">
                <table class="w-full text-left">
                  <thead>
                    <tr class="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 sticky top-0 bg-white">
                      <th class="px-6 py-4">Month</th>
                      <th class="px-6 py-4 text-right">Revenue (LKR)</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-50">
                    <tr *ngFor="let m of reportData.monthly_income" class="hover:bg-slate-50 transition-colors">
                      <td class="px-6 py-4 font-bold text-slate-800 text-xs">{{ m.month }}</td>
                      <td class="px-6 py-4 text-right font-bold text-emerald-600">{{ m.total | number:'1.2-2' }}</td>
                    </tr>
                    <tr *ngIf="!reportData.monthly_income?.length">
                      <td colspan="2" class="px-6 py-8 text-center text-slate-400 text-xs">No monthly revenue data found.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ================= ASSET USAGE LOG SECTION ================= -->
      <section class="pt-8 border-t border-slate-200 border-dashed">
        <header class="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 mb-6">
          <div>
            <h1 class="text-xl font-bold text-slate-900 leading-tight">Asset Usage & Customer Log</h1>
            <p class="text-slate-400 text-sm">Monitor which customers rented vehicles and their mileage logs.</p>
          </div>
          <div class="w-full md:w-auto">
            <button (click)="downloadReport('usage')" class="w-full md:w-auto bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
              Print Usage Log
            </button>
          </div>
        </header>

        <div class="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-slate-100 flex flex-col lg:flex-row items-end gap-4 mb-6">
           <div class="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                 <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Asset Filter</label>
                 <select [(ngModel)]="usageVehicleId" class="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm text-slate-700 font-medium focus:ring-2 focus:ring-primary-500 outline-none transition-all hover:bg-slate-100">
                   <option [ngValue]="null">All Vehicles</option>
                   <option *ngFor="let v of vehicles" [ngValue]="v.id">{{ v.model }} ({{ v.plate_no }})</option>
                 </select>
              </div>
              <div>
                 <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Start Date</label>
                 <input type="date" [(ngModel)]="usageStartDate" class="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm text-slate-700 font-medium focus:ring-2 focus:ring-primary-500 outline-none transition-all hover:bg-slate-100">
              </div>
              <div>
                 <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">End Date</label>
                 <input type="date" [(ngModel)]="usageEndDate" class="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm text-slate-700 font-medium focus:ring-2 focus:ring-primary-500 outline-none transition-all hover:bg-slate-100">
              </div>
           </div>
           <div class="w-full lg:w-auto mt-2 lg:mt-0">
              <button (click)="loadUsageReport()" class="w-full bg-emerald-600 text-white px-8 py-2.5 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/20 h-[42px]">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                Apply Filter
              </button>
           </div>
        </div>

        <div *ngIf="usageLoading" class="flex justify-center py-10">
          <div class="w-8 h-8 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin"></div>
        </div>

        <div *ngIf="!usageLoading && usageData" class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div class="p-5 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
             <h2 class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Booking History</h2>
             <span class="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md">{{ usageData.length }} Records</span>
          </div>
          <div class="overflow-x-auto max-h-[500px] styled-scroll">
            <table class="w-full text-left whitespace-nowrap">
              <thead>
                <tr class="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 sticky top-0 bg-white">
                  <th class="px-6 py-4">Customer</th>
                  <th class="px-6 py-4">Vehicle</th>
                  <th class="px-6 py-4">Duration</th>
                  <th class="px-6 py-4 text-center">Mileage (Out - In)</th>
                  <th class="px-6 py-4 text-right">Revenue (LKR)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50">
                <tr *ngFor="let b of usageData" class="hover:bg-slate-50 transition-colors">
                  <td class="px-6 py-4 font-bold text-slate-800 text-xs">{{ b.customer_name }}</td>
                  <td class="px-6 py-4 text-slate-600 text-xs">{{ b.vehicle }}</td>
                  <td class="px-6 py-4 text-slate-600 text-xs">{{ b.pickup_date }} to {{ b.return_date }}</td>
                  <td class="px-6 py-4 text-slate-600 text-xs text-center">{{ b.pickup_km }} - {{ b.return_km }} km</td>
                  <td class="px-6 py-4 text-right font-bold text-emerald-600">{{ b.total_price | number:'1.2-2' }}</td>
                </tr>
                <tr *ngIf="!usageData?.length">
                  <td colspan="5" class="px-6 py-8 text-center text-slate-400 text-xs">No booking records found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>

    <!-- EXCLUSIVE PRINT VIEW (VISIBLE ONLY ON PRINT) -->
    <div class="hidden print:block w-full bg-white text-black font-sans">
      <!-- Print Header -->
      <div class="border-b-2 border-slate-800 pb-4 mb-8 flex justify-between items-end">
        <div>
          <h1 class="text-3xl font-black uppercase tracking-widest text-slate-900 m-0 leading-none">NS Rent A Car</h1>
          <p class="text-sm font-bold text-slate-500 mt-2 uppercase tracking-wider">Official Financial Report</p>
        </div>
        <div class="text-right">
          <p class="text-sm font-bold m-0">Generated: {{ currentDate | date:'medium' }}</p>
          <p class="text-sm font-bold mt-1 text-slate-600" *ngIf="startDate && endDate">Period: {{ startDate | date }} to {{ endDate | date }}</p>
        </div>
      </div>

      <div *ngIf="reportData">
        <ng-container *ngIf="printType === 'financial' || printType === 'all'">
        <!-- Summary Section -->
        <div class="mb-10">
          <h2 class="text-base font-bold uppercase border-b-2 border-slate-300 mb-4 pb-2 tracking-widest">1. Executive Summary</h2>
          <table class="w-full text-sm border-collapse border-2 border-slate-400">
            <tbody>
              <tr>
                <td class="border border-slate-400 p-3 font-bold bg-slate-100 w-1/2 uppercase text-xs tracking-wider">Total Revenue Generated</td>
                <td class="border border-slate-400 p-3 font-black text-right text-base">LKR {{ reportData?.total_income | number:'1.2-2' }}</td>
              </tr>
              <tr>
                <td class="border border-slate-400 p-3 font-bold bg-slate-100 uppercase text-xs tracking-wider">Top Earning Asset</td>
                <td class="border border-slate-400 p-3 text-right font-semibold">{{ getTopVehicleName() || 'N/A' }}</td>
              </tr>
              <tr>
                <td class="border border-slate-400 p-3 font-bold bg-slate-100 uppercase text-xs tracking-wider">Active Operational Months</td>
                <td class="border border-slate-400 p-3 text-right font-semibold">{{ reportData?.monthly_income?.length || 0 }} Months</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Vehicle Revenue Section -->
        <div class="mb-10" style="page-break-inside: avoid;">
          <h2 class="text-base font-bold uppercase border-b-2 border-slate-300 mb-4 pb-2 tracking-widest">2. Revenue by Vehicle (Asset Performance)</h2>
          <table class="w-full text-sm border-collapse border-2 border-slate-400">
            <thead>
              <tr class="bg-slate-100">
                <th class="border border-slate-400 p-3 text-center font-bold w-16 uppercase text-xs tracking-wider">#</th>
                <th class="border border-slate-400 p-3 text-left font-bold uppercase text-xs tracking-wider">Vehicle details</th>
                <th class="border border-slate-400 p-3 text-right font-bold w-48 uppercase text-xs tracking-wider">Revenue (LKR)</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let v of reportData?.vehicle_income; let i = index">
                <td class="border border-slate-400 p-3 text-center">{{ i + 1 }}</td>
                <td class="border border-slate-400 p-3">{{ v.vehicle }}</td>
                <td class="border border-slate-400 p-3 text-right font-bold">LKR {{ v.earned | number:'1.2-2' }}</td>
              </tr>
              <tr *ngIf="!reportData?.vehicle_income?.length">
                <td colspan="3" class="border border-slate-400 p-4 text-center italic text-slate-500">No vehicle revenue data found.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Monthly Revenue Section -->
        <div class="mb-10" style="page-break-inside: avoid;">
          <h2 class="text-base font-bold uppercase border-b-2 border-slate-300 mb-4 pb-2 tracking-widest">3. Monthly Revenue Trend</h2>
          <table class="w-full text-sm border-collapse border-2 border-slate-400">
            <thead>
              <tr class="bg-slate-100">
                <th class="border border-slate-400 p-3 text-center font-bold w-16 uppercase text-xs tracking-wider">#</th>
                <th class="border border-slate-400 p-3 text-left font-bold uppercase text-xs tracking-wider">Month / Year</th>
                <th class="border border-slate-400 p-3 text-right font-bold w-48 uppercase text-xs tracking-wider">Revenue (LKR)</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let m of reportData?.monthly_income; let i = index">
                <td class="border border-slate-400 p-3 text-center">{{ i + 1 }}</td>
                <td class="border border-slate-400 p-3">{{ m.month }}</td>
                <td class="border border-slate-400 p-3 text-right font-bold">LKR {{ m.total | number:'1.2-2' }}</td>
              </tr>
              <tr *ngIf="!reportData?.monthly_income?.length">
                <td colspan="3" class="border border-slate-400 p-4 text-center italic text-slate-500">No monthly revenue data found.</td>
              </tr>
            </tbody>
          </table>
        </div>
        </ng-container>
      </div>

      <!-- Asset Usage & Customer Log Section (Print View) -->
        <div class="mb-10" *ngIf="usageData && (printType === 'usage' || printType === 'all')">
          <h2 class="text-base font-bold uppercase border-b-2 border-slate-300 mb-4 pb-2 tracking-widest">4. Asset Usage & Customer Log</h2>
          <table class="w-full text-sm border-collapse border-2 border-slate-400">
            <thead>
              <tr class="bg-slate-100">
                <th class="border border-slate-400 p-3 text-center font-bold w-12 uppercase text-xs tracking-wider">#</th>
                <th class="border border-slate-400 p-3 text-left font-bold uppercase text-xs tracking-wider">Customer</th>
                <th class="border border-slate-400 p-3 text-left font-bold uppercase text-xs tracking-wider">Vehicle</th>
                <th class="border border-slate-400 p-3 text-center font-bold uppercase text-xs tracking-wider">Period</th>
                <th class="border border-slate-400 p-3 text-center font-bold uppercase text-xs tracking-wider">Mileage (Out - In)</th>
                <th class="border border-slate-400 p-3 text-right font-bold uppercase text-xs tracking-wider">Revenue</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let b of usageData; let i = index">
                <td class="border border-slate-400 p-3 text-center">{{ i + 1 }}</td>
                <td class="border border-slate-400 p-3">{{ b.customer_name }}</td>
                <td class="border border-slate-400 p-3">{{ b.vehicle }}</td>
                <td class="border border-slate-400 p-3 text-center whitespace-nowrap">{{ b.pickup_date }}<br/>to<br/>{{ b.return_date }}</td>
                <td class="border border-slate-400 p-3 text-center whitespace-nowrap">{{ b.pickup_km }} - {{ b.return_km }}</td>
                <td class="border border-slate-400 p-3 text-right font-bold whitespace-nowrap">LKR {{ b.total_price | number:'1.2-2' }}</td>
              </tr>
              <tr *ngIf="!usageData?.length">
                <td colspan="6" class="border border-slate-400 p-4 text-center italic text-slate-500">No booking records found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      <!-- Footer -->
      <div class="mt-16 text-center text-[10px] text-slate-500 border-t-2 border-slate-200 pt-6 uppercase tracking-widest font-bold">
        <p>This is a computer-generated document. No physical signature is required.</p>
        <p class="mt-1">NS Rent A Car Enterprise System &copy; {{ currentDate | date:'yyyy' }}</p>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .styled-scroll {
      overflow-y: auto;
      overflow-x: auto;
    }
    .styled-scroll::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    .styled-scroll::-webkit-scrollbar-track {
      background: #f8fafc;
      border-radius: 99px;
    }
    .styled-scroll::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, #94a3b8, #64748b);
      border-radius: 99px;
      transition: background 0.2s;
    }
    .styled-scroll::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(180deg, #64748b, #334155);
    }
    .styled-scroll::-webkit-scrollbar-corner {
      background: #f8fafc;
    }

    @media print {
      @page { size: A4 portrait; margin: 15mm; }
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    }
  `]
})
export class ReportsComponent implements OnInit {
  loading = false;
  reportData: any = null;
  startDate: string = '';
  endDate: string = '';
  selectedVehicleId: number | null = null;
  printType: any = 'all';
  
  usageLoading = false;
  usageData: any[] | null = null;
  usageStartDate: string = '';
  usageEndDate: string = '';
  usageVehicleId: number | null = null;

  vehicles: any[] = [];
  currentDate = new Date();

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadVehicles();
    this.loadReport();
    this.loadUsageReport();
  }

  loadVehicles() {
    this.api.getVehicles().subscribe((res: any) => {
      this.vehicles = res.data || res;
    });
  }

  loadReport() {
    this.loading = true;
    this.api.getIncomeReport(this.startDate, this.endDate, this.selectedVehicleId || undefined).subscribe({
      next: (res: any) => {
        this.reportData = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load report', err);
        this.loading = false;
      }
    });
  }

  loadUsageReport() {
    this.usageLoading = true;
    this.api.getUsageReport(this.usageStartDate, this.usageEndDate, this.usageVehicleId || undefined).subscribe({
      next: (res: any) => {
        this.usageData = res;
        this.usageLoading = false;
      },
      error: (err) => {
        console.error('Failed to load usage report', err);
        this.usageLoading = false;
      }
    });
  }

  getTopVehicleName() {
    if (this.reportData?.vehicle_income?.length > 0) {
      return this.reportData.vehicle_income[0].vehicle;
    }
    return null;
  }

  downloadReport(type: 'financial' | 'usage' | 'all' = 'all') {
    this.printType = type;
    setTimeout(() => {
      window.print();
    }, 100);
  }
}
