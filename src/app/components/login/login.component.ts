import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) { }

  login(): void {
    if (!this.email || !this.password) {
      this.error = 'Please fill in all fields.';
      return;
    }

    this.loading = true;
    this.error = '';

    this.auth.login({ email: this.email, password: this.password })
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          this.router.navigate(['/news']);
        },
        error: (err) => {
          this.error = 'Invalid email or password.';
          console.error('Login error', err);
        }
      });
  }
}
