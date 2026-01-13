import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

interface LoginResponse {
  user: User;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userKey = 'loggedUser';
  private tokenKey = 'authToken';
  private apiUrl = `${environment.apiUrl}/Auth`;

  constructor(private http: HttpClient) { }

  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem(this.userKey, JSON.stringify(response.user));
        localStorage.setItem(this.tokenKey, response.token);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getLoggedUser(): User | null {
    const val = localStorage.getItem(this.userKey);
    return val ? JSON.parse(val) : null;
  }

  logout() {
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
