import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // private apiUrl = 'https://api.nsrentacarmanager.online/api';
  private apiUrl = 'http://localhost:8000/api';
  private isAuthenticated = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient, private router: Router) { }

  private hasToken(): boolean {
    return !!sessionStorage.getItem('token');
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
          sessionStorage.setItem('token', res.token);
          sessionStorage.setItem('user', JSON.stringify(res.user));
          this.isAuthenticated.next(true);
        }
      })
    );
  }

  logout() {
    this.http.post(`${this.apiUrl}/logout`, {}, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
    }).subscribe({
      next: () => this.clearSession(),
      error: () => this.clearSession()
    });
  }

  private clearSession() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    this.isAuthenticated.next(false);
    this.router.navigate(['/login']);
  }

  getToken() {
    return sessionStorage.getItem('token');
  }
}
