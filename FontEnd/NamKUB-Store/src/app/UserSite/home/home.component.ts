import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  bannerImage: string = 'HomePage.webp';
  searchText = '';
  private boundHandleThemeChange: EventListener;
  private queryParamsSubscription?: Subscription;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.queryParamsSubscription = this.route.queryParamMap.subscribe(params => {
      this.searchText = params.get('q')?.trim() || '';
    });

    if (isPlatformBrowser(this.platformId)) {
      const storedTheme = localStorage.getItem('theme');
      this.updateBannerImage(storedTheme === 'dark');

      this.boundHandleThemeChange = ((event: Event) => {
        const themeEvent = event as CustomEvent<{ darkMode: boolean }>;
        this.updateBannerImage(themeEvent.detail.darkMode);
      }) as EventListener;

      window.addEventListener('themeChange', this.boundHandleThemeChange);
    }
  }

  ngOnDestroy(): void {
    this.queryParamsSubscription?.unsubscribe();

    if (isPlatformBrowser(this.platformId) && this.boundHandleThemeChange) {
      window.removeEventListener('themeChange', this.boundHandleThemeChange);
    }
  }

  updateBannerImage(isDarkMode: boolean): void {
    this.bannerImage = isDarkMode ? 'darkWater.avif' : 'HomePage.webp';
  }
}
