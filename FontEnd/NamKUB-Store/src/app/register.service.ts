
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { NAMKUBAPIService } from './Service/namkub-api.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  constructor(private http: HttpClient, private apiService: NAMKUBAPIService) { }

  // ฟังก์ชันสำหรับส่งข้อมูลการลงทะเบียนผู้ใช้
  registerUser(userData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    console.log('Sending mock registration request');
    console.log('Request body:', userData);

    return this.apiService.registerUser(userData).pipe(
      tap(response => {
        console.log('Registration response:', response);
      }),
      catchError(error => {
        console.error('Registration error:', error);
        return throwError(error);
      })
    );
  }
}

