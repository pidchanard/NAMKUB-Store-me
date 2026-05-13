
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Users } from './model/products';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usernameSubject = new BehaviorSubject<string | null>(null);
  public username$ = this.usernameSubject.asObservable();
  public pictureBehaviorSubject = new BehaviorSubject<string | null >(null);
  public picture = this.pictureBehaviorSubject.asObservable();


  constructor(private router: Router) {
    if (!this.hasLocalStorage()) {
      return;
    }

    const token =localStorage.getItem('token');
    if(token){
      const payload =this.decodeToken(token);
      const username =payload?.user?.username || null;
      const picture = this.getSavedProfilePicture(username) || payload?.user?.picture || null;
      this.usernameSubject.next(username);
      this.pictureBehaviorSubject.next(picture);

    }
  }


  login(token:string):void{
    if (!this.hasLocalStorage()) {
      return;
    }

    localStorage.setItem('token',token);
    const payload =this.decodeToken(token);
    const username =payload?.user?.username || null;
    const picture = this.getSavedProfilePicture(username) || payload?.user?.picture || null;
    this.usernameSubject.next(username);
    this.pictureBehaviorSubject.next(picture);
  }

  // Simulate user logout
  logout(): void {
    if (this.hasLocalStorage()) {
      localStorage.removeItem('token');
    }
    this.usernameSubject.next(null);
    this.router.navigate(['/']); // Redirect to home or login page
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    if (!this.hasLocalStorage()) {
      return false;
    }

    return !!localStorage.getItem('token'); // Return true if there is a token
  }

  // Get the role of the user from the payload in localStorage
  getRole(): string | null {
   
    if (!this.hasLocalStorage()) {
      return null;
    }

    const token =localStorage.getItem('token');
    if(token){
      const payload =this.decodeToken(token);
      return payload?.user?.role||null;
    }
    return null;
  }
  getUsername():string |null{
    if (!this.hasLocalStorage()) {
      return null;
    }

    const token=localStorage.getItem('token');
    if(token){
      const payload =this.decodeToken(token);
      return payload?.user?.username||null;
    }
    return null;
  }
  getPicture(){
    if (!this.hasLocalStorage()) {
      return null;
    }

    const token=localStorage.getItem('token');
    if(token){
      const payload =this.decodeToken(token);
      const username = payload?.user?.username || null;
      return this.getSavedProfilePicture(username) || payload?.user?.picture || null;
    }
  }

  getCurrentUser(): Partial<Users> | null {
    if (!this.hasLocalStorage()) {
      return null;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }

    const payload = this.decodeToken(token);
    const tokenUser = payload?.user || null;
    if (!tokenUser) {
      return null;
    }

    const savedUser = this.getSavedProfileData(tokenUser.username);
    const picture = this.getSavedProfilePicture(tokenUser.username) || savedUser?.picture || tokenUser.picture || null;
    return { ...tokenUser, ...savedUser, picture };
  }

  setProfileData(userData: Partial<Users>): void {
    if (!this.hasLocalStorage()) {
      return;
    }

    const username = userData.username || this.getUsername();
    if (!username) {
      return;
    }

    localStorage.setItem(`profileData:${username}`, JSON.stringify(userData));
    if (userData.picture) {
      this.setProfilePicture(userData.picture);
    }
  }

  setProfilePicture(picture: string): void {
    if (!this.hasLocalStorage()) {
      return;
    }

    const username = this.getUsername();
    if (username) {
      localStorage.setItem(`profilePicture:${username}`, picture);
    }
    this.pictureBehaviorSubject.next(picture);
  }
  // Decode JWT token
  private decodeToken(token: string):any{
    try{
      return jwtDecode(token);

    }catch(error){
      console.error('Failed to decode token',error);
      return null;
    }
  }

  private hasLocalStorage(): boolean {
    return typeof localStorage !== 'undefined';
  }

  private getSavedProfilePicture(username: string | null): string | null {
    if (!username || !this.hasLocalStorage()) {
      return null;
    }

    return localStorage.getItem(`profilePicture:${username}`);
  }

  private getSavedProfileData(username: string | null): Partial<Users> | null {
    if (!username || !this.hasLocalStorage()) {
      return null;
    }

    const savedData = localStorage.getItem(`profileData:${username}`);
    if (!savedData) {
      return null;
    }

    try {
      return JSON.parse(savedData);
    } catch (error) {
      console.error('Failed to parse saved profile data', error);
      return null;
    }
  }
}

