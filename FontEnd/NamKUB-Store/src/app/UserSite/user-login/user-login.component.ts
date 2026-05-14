import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NAMKUBAPIService } from '../../Service/namkub-api.service';
import { AuthService } from '../../auth.service';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  userRole: string | null = null;
  isLoading: boolean = true;

  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "bi bi-eye-slash-fill";

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: NAMKUBAPIService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.isLoading = false;
      return;
    }

    const token = localStorage.getItem('token');
    if (token) {
      this.userRole = this.authService.getRole();
      if (this.userRole === 'admin') {
        this.router.navigate(['/dashboard']);
      } else if (this.userRole === 'customer') {
        this.router.navigate(['/home']);
      } else {
        this.isLoading = false;
      }
    } else {
      this.isLoading = false;
    }
  }

  onLogin(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Username and password are required';
      return;
    }

    const loginData = { username: this.username, password: this.password };

    this.apiService.login(loginData.username, loginData.password)
      .subscribe({
        next: (response) => {
          console.log('API Response:', response);
          if (response.token) {
            this.authService.login(response.token);

            this.userRole = this.authService.getRole();
            console.log('User Role:', this.userRole);

            if (this.userRole === 'admin') {
              this.router.navigate(['/dashboard']);
            } else if (this.userRole === 'customer') {
              this.router.navigate(['/home']);
            }
          } else {
            this.errorMessage = 'Login failed. No token received.';
          }
        },
        error: (error) => {
          if (error.status === 401) {
            this.errorMessage = 'Invalid username or password';
          } else {
            this.errorMessage = 'Server error';
          }
        }
      });
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "bi bi-eye-fill" : this.eyeIcon = "bi bi-eye-slash-fill";
    this.isText ? this.type = "text" : this.type = "password";
  }
}
