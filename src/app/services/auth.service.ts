import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userKey = 'loggedUser';

  login(user: User) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getLoggedUser(): User | null {
    const val = localStorage.getItem(this.userKey);
    return val ? JSON.parse(val) : null;
  }

  logout() {
    localStorage.removeItem(this.userKey);
  }

  isLoggedIn(): boolean {
    return !!this.getLoggedUser();
  }
}
