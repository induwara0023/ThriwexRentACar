import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://thriwexrentacarbackend.onrender.com/api';
  private isAuthenticated = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient, private router: Router) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  getAuthStatus() {
    return this.isAuthenticated.asObservable();
  }

  isLoggedIn() {
    return this.hasToken();
  }

  login(credentials: any) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          this.isAuthenticated.next(true);
        }
      })
    );
  }

  logout() {
    this.http.post(`${this.apiUrl}/logout`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe({
      next: () => this.clearSession(),
      error: () => this.clearSession()
    });
  }

  private clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isAuthenticated.next(false);
    this.router.navigate(['/login']);
  }

  getToken() {
    return localStorage.getItem('token');
  }
}
