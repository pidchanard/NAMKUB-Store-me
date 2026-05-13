import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { NAMKUBAPIService } from './Service/namkub-api.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  constructor(private http: HttpClient, private apiService: NAMKUBAPIService) { }

  // Function for sending admin registration data
  registerAdmin(adminData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    console.log('Sending mock admin registration request');
    console.log('Request body:', adminData);

    return this.apiService.registerAdmin(adminData).pipe(
      tap(response => {
        console.log('Admin registration response:', response);
      }),
      catchError(error => {
        console.error('Admin registration error:', error);
        return throwError(error);
      })
    );
  }
}
