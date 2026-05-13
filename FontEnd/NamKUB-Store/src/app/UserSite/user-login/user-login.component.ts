
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NAMKUBAPIService } from '../../Service/namkub-api.service';
import { AuthService } from '../../auth.service'; // นำเข้า AuthService
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  userRole: string | null = null; // ประกาศตัวแปร userRole

  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "bi bi-eye-slash-fill";

  constructor(private http: HttpClient, private router: Router, private authService: AuthService, private apiService: NAMKUBAPIService, @Inject(PLATFORM_ID) private platformId: any) {}

  ngOnInit(): void {
    // ตรวจสอบว่า login ไว้หรือยัง
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const token = localStorage.getItem('token');
    if (token) {
      this.userRole = this.authService.getRole();
      if (this.userRole === 'admin') {
        this.router.navigate(['/dashboard']);
      } else if (this.userRole === 'customer') {
        this.router.navigate(['/home']);
      }
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
            // ใช้ AuthService ในการจัดการ token
            this.authService.login(response.token);

            // ดึง role จาก token ที่ถอดรหัสแล้ว
            this.userRole = this.authService.getRole();
            console.log('User Role:', this.userRole);

            // Navigate based on the user's role
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
