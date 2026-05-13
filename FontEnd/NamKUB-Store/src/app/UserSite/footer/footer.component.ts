import { Component, OnInit, Renderer2, Inject, OnDestroy } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit, OnDestroy {
  private boundHandleThemeChange: Function;

  constructor(
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Bind the method once and use the same reference for adding and removing the event listener
      this.boundHandleThemeChange = this.handleThemeChange.bind(this);
      window.addEventListener('themeChange', this.boundHandleThemeChange as EventListener);
      this.applyInitialTheme();
    }
  }

  ngOnDestroy(): void {
    // Use the same bound function reference to remove the event listener
    if (isPlatformBrowser(this.platformId) && this.boundHandleThemeChange) {
      window.removeEventListener('themeChange', this.boundHandleThemeChange as EventListener);
    }
  }

  handleThemeChange(event: CustomEvent) {
    const isDarkMode = event.detail.darkMode;
    this.applyTheme(isDarkMode);
  }

  applyInitialTheme() {
    const isDarkMode = localStorage.getItem('theme') === 'dark';
    this.applyTheme(isDarkMode);
  }

  applyTheme(isDarkMode: boolean) {
    const footer = document.querySelector('.footer');
    if (footer) {
      if (isDarkMode) {
        this.renderer.setStyle(footer, 'background', 'linear-gradient(120deg, #001f3f, #5b2c6f, #000)');
      } else {
        this.renderer.setStyle(footer, 'background', 'linear-gradient(120deg, #AFD5F0, #0074D9, #6b6bfd)');
      }
    }
  }
}
