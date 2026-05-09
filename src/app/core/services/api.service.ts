import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://thriwexrentacarbackend.onrender.com/api'; // Laravel Backend

  constructor(private http: HttpClient) {}

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

  searchCustomer(nic: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/customers/search/${nic}`);
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
}
