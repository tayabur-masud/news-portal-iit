import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userKey = 'loggedUser';

  login(user: any) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getLoggedUser(): any | null {
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
