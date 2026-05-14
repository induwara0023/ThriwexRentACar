import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // localapiurl
  private baseUrl = 'http://localhost:8000/api';

  // hostapiurl
  // private baseUrl = 'https://api.nsrentacarmanager.online/api';

  constructor(private http: HttpClient) { }

  // Bookings
  getBookings(): Observable<any> {
    return this.http.get(`${this.baseUrl}/bookings`);
  }

  getDashboardSummary(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard/summary`);
  }

  getFleetAlerts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/fleet/alerts`);
  }

  createBooking(data: any): Observable<any> {
    if (data instanceof FormData) {
      return this.http.post(`${this.baseUrl}/bookings/store`, data);
    }
    return this.http.post(`${this.baseUrl}/bookings/store`, data);
  }

  completeBooking(id: number, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/bookings/${id}/complete`, data);
  }

  finalizeBooking(id: number, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/bookings/${id}/finalize`, data);
  }

  // Customers
  getCustomers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/customers`);
  }

  createCustomer(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/customers`, data);
  }

  updateCustomer(id: number, data: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/customers/${id}?_method=PUT`, data);
  }

  searchCustomer(nic: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/customers/search/${nic}`);
  }

  deleteCustomer(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/customers/${id}`);
  }

  // Vehicles
  getVehicles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/vehicles`);
  }

  registerVehicle(data: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/vehicles`, data);
  }

  updateVehicle(id: number, data: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/vehicles/${id}?_method=PUT`, data);
  }

  getVehicleHistory(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/vehicles/${id}/history`);
  }

  getAvailableVehicles(startTime: string, endTime: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/vehicles/available`, {
      params: { start_time: startTime, end_time: endTime }
    });
  }

  deleteVehicle(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/vehicles/${id}`);
  }

  // Reports
  getIncomeReport(startDate?: string, endDate?: string, vehicleId?: number): Observable<any> {
    let params: any = {};
    if (startDate && endDate) {
      params = { ...params, start_date: startDate, end_date: endDate };
    }
    if (vehicleId) {
      params = { ...params, vehicle_id: vehicleId };
    }
    return this.http.get(`${this.baseUrl}/reports/income`, { params });
  }

  getUsageReport(startDate?: string, endDate?: string, vehicleId?: number): Observable<any> {
    let params: any = {};
    if (startDate && endDate) {
      params = { ...params, start_date: startDate, end_date: endDate };
    }
    if (vehicleId) {
      params = { ...params, vehicle_id: vehicleId };
    }
    return this.http.get(`${this.baseUrl}/reports/usage`, { params });
  }

  // Admin Management
  getAdmins(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admins`);
  }

  createAdmin(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/admins`, data);
  }

  updateAdmin(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/admins/${id}`, data);
  }

  deleteAdmin(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/admins/${id}`);
  }

  // Driver Management
  getDrivers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/drivers`);
  }

  saveDriver(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/drivers`, data);
  }

  updateDriver(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/drivers/${id}`, data);
  }

  deleteDriver(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/drivers/${id}`);
  }

  // Hire Bookings
  getHires(): Observable<any> {
    return this.http.get(`${this.baseUrl}/hires`);
  }

  saveHire(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/hires`, data);
  }

  completeHire(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/hires/${id}/complete`, {});
  }

  deleteHire(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/hires/${id}`);
  }
}
