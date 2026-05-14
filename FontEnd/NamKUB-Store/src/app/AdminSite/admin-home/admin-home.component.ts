import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit, OnDestroy {
  isDarkMode = false;
  isOpen = false;
  searchTerm = '';
  private routerSubscription?: Subscription;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private renderer: Renderer2,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.isOpen = localStorage.getItem('sidebarOpen') === 'true';
    this.isDarkMode = localStorage.getItem('isDarkMode') === 'true';
    this.applyTheme();
    this.syncSidebarClass();
    this.syncSearchTermFromUrl();
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.syncSearchTermFromUrl());
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
    if (isPlatformBrowser(this.platformId)) {
      this.renderer.removeClass(document.body, 'admin-sidebar-open');
    }
  }

  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
    this.syncSidebarClass();

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('sidebarOpen', String(this.isOpen));
    }
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('isDarkMode', String(this.isDarkMode));
    }
  }

  applyTheme(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'dark-mode');
      this.renderer.removeClass(document.body, 'light-mode');
    } else {
      this.renderer.addClass(document.body, 'light-mode');
      this.renderer.removeClass(document.body, 'dark-mode');
    }
  }

  onLogout(): void {
    this.authService.logout();
  }

  searchAdmin(): void {
    const query = this.searchTerm.trim();
    this.router.navigate([this.getSearchRoute()], {
      queryParams: query ? { q: query } : {}
    });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchAdmin();
  }

  private syncSidebarClass(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.isOpen) {
      this.renderer.addClass(document.body, 'admin-sidebar-open');
    } else {
      this.renderer.removeClass(document.body, 'admin-sidebar-open');
    }
  }

  private syncSearchTermFromUrl(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.searchTerm = this.router.parseUrl(this.router.url).queryParams['q'] || '';
  }

  private getSearchRoute(): string {
    const currentUrl = this.router.url.split('?')[0];
    const searchableRoutes = ['/editproduct', '/order', '/stockmanage', '/memberlist'];
    return searchableRoutes.includes(currentUrl) ? currentUrl : '/editproduct';
  }
}
