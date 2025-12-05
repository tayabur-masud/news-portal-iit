import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  users: any[] = [];
  selectedUser: any;

  constructor(private usersService: UsersService, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.usersService.getAll().subscribe(users => this.users = users);
  }

  login(): void {
    if (!this.selectedUser) {
      alert('Please select a user.');
      return;
    }
    this.auth.login(this.selectedUser);
    this.router.navigate(['/news']);
  }
}
