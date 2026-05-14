import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return true;
    }

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    const requiredRoles: string[] = route.data['roles'] || [];
    const userRole = this.authService.getRole();

    if (requiredRoles.length === 0 || (userRole && requiredRoles.includes(userRole))) {
      return true;
    }

    this.router.navigate(['/NoAccess']);
    return false;
  }
}
