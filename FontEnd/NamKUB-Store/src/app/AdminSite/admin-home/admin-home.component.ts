import { Component, OnInit, Inject, Renderer2 } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {
  isDarkMode: boolean = false;
  isOpen = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private renderer: Renderer2
  ) {}


  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedState = localStorage.getItem('sidebarOpen');
      this.isOpen = savedState === 'true'; // โหลดค่าเปิด/ปิดจาก localStorage

      const savedTheme = localStorage.getItem('isDarkMode');
      this.isDarkMode = savedTheme === 'true';
      this.applyTheme();
    }
  }
  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
    console.log('Sidebar isOpen:', this.isOpen); // ดูว่าค่าถูกเปลี่ยนจริงหรือไม่
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('sidebarOpen', this.isOpen.toString());
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
    if (isPlatformBrowser(this.platformId)) {
      if (this.isDarkMode) {
        this.renderer.addClass(document.body, 'dark-mode');
        this.renderer.removeClass(document.body, 'light-mode');
      } else {
        this.renderer.addClass(document.body, 'light-mode');
        this.renderer.removeClass(document.body, 'dark-mode');
      }
      console.log('Theme applied:', this.isDarkMode ? 'dark-mode' : 'light-mode');
    }
  }

}
