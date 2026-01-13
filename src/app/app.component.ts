import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.css'
})
export class AppComponent {
  constructor(public auth: AuthService, private router: Router) { }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
