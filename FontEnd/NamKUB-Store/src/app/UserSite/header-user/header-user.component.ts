import { Component, Renderer2, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Users } from '../../model/products';
import { NAMKUBAPIService } from '../../Service/namkub-api.service';
import { CartServiceService } from '../../Service/cart-service.service';



@Component({
  selector: 'app-header-user',
  templateUrl: './header-user.component.html',
  styleUrls: ['./header-user.component.css']
})
export class HeaderUserComponent implements OnInit {
  username: string | null = null;
  isDarkMode: boolean = false;
  isProfilePopupVisible = false;
  user = new BehaviorSubject<Users[]>([]);
  picture: string | null;
  cartCount$: Observable<number>;
  defaultProfileImage = 'anya.jpg';
  searchTerm = '';

  constructor(
    private router: Router,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: any, 
    private authService: AuthService,
    private userapi : NAMKUBAPIService,
    private cartService: CartServiceService
  ) {
    this.cartCount$ = this.cartService.cartCount$;
  }

  ngOnInit(): void {
    // ตรวจสอบว่ากำลังทำงานในเบราว์เซอร์
    if (isPlatformBrowser(this.platformId)) {
      this.username = this.authService.getUsername();
      this.picture = this.authService.getPicture() || this.defaultProfileImage;
      this.authService.picture.subscribe((picture) => {
        this.picture = picture || this.defaultProfileImage;
      });

      // ตรวจสอบว่ามีการเรียกใช้งาน localStorage ได้หรือไม่
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'dark') {
        this.isDarkMode = true;
        this.renderer.addClass(document.body, 'dark-mode');
      } else {
        this.isDarkMode = false;
        this.renderer.removeClass(document.body, 'dark-mode');
      }

      // อัปเดตสีพื้นหลังของ navbar และ profile popup
      this.updateNavbarColor();
      this.updateProfilePopupBackground(); // อัปเดตพื้นหลังของ profile popup ตามโหมดที่ใช้อยู่
    }
  }

  

  // ฟังก์ชันสลับโหมดมืดและสว่าง
  toggleDarkMode(): void {
    // ตรวจสอบว่ากำลังทำงานในเบราว์เซอร์
    if (isPlatformBrowser(this.platformId)) {
      this.isDarkMode = !this.isDarkMode;
      if (this.isDarkMode) {
        this.renderer.addClass(document.body, 'dark-mode');
        localStorage.setItem('theme', 'dark');
      } else {
        this.renderer.removeClass(document.body, 'dark-mode');
        localStorage.setItem('theme', 'light');
      }
      window.dispatchEvent(new CustomEvent('themeChange', { detail: { darkMode: this.isDarkMode } }));
      // อัปเดตสีพื้นหลังของ navbar และ profile popup
      this.updateNavbarColor();
      this.updateProfilePopupBackground(); // เปลี่ยนสีพื้นหลัง popup ทันที
    }
  }

  // อัปเดตสี navbar ให้ตรงกับโหมดปัจจุบัน
  updateNavbarColor(): void {
    const navbar = document.querySelector('.navbar') as HTMLElement;
    if (navbar) {
      if (this.isDarkMode) {
        navbar.style.background = 'linear-gradient(120deg, #07172d, #24153f, #14091f)';
      } else {
        navbar.style.background = 'linear-gradient(120deg, #72bee9, #0d83d9, #5966f4)';
      }
    }
  }

  // แสดง/ซ่อน profile popup และเปลี่ยนสีพื้นหลังทันทีเมื่อกดที่ชื่อ
  toggleProfilePopup(): void {
    this.isProfilePopupVisible = !this.isProfilePopupVisible;

    // ดึง element profilePopup ให้แน่ใจว่าอยู่ใน DOM
    const profilePopup = document.getElementById('profilePopup') as HTMLElement;
    if (profilePopup) {
      if (this.isProfilePopupVisible) {
        // แสดง profile popup
        profilePopup.style.display = 'block';

        // ตรวจสอบว่าโหมดมืดหรือสว่างและเปลี่ยนสีพื้นหลัง popup
        this.updateProfilePopupBackground();
      } else {
        // ซ่อน profile popup
        profilePopup.style.display = 'none';
      }
    } else {
      console.error("Element 'profilePopup' not found in DOM");
    }
  }

  // ฟังก์ชันเปลี่ยนสีพื้นหลังของ profile popup ให้ตรงกับ navbar
  updateProfilePopupBackground(): void {
    const profilePopup = document.getElementById('profilePopup') as HTMLElement;
    if (profilePopup) {
      if (this.isDarkMode) {
        // เปลี่ยนเป็นสีโหมดมืด
        profilePopup.style.background = 'linear-gradient(120deg, #07172d, #24153f, #14091f)';
      } else {
        // เปลี่ยนเป็นสีโหมดสว่าง
        profilePopup.style.background = 'linear-gradient(120deg, #72bee9, #0d83d9, #5966f4)';
      }
    } else {
      console.error("Element 'profilePopup' not found in DOM when updating background");
    }
  }

  logout(): void {
    // ตรวจสอบว่ากำลังทำงานในเบราว์เซอร์
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      this.router.navigate(['/']);
    }
  }

  editProfile(): void {
    this.router.navigate(['/edit-profile']);
  }

  searchProducts(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
    this.router.navigate([this.getSearchTargetRoute()], {
      queryParams: this.searchTerm.trim() ? { q: this.searchTerm.trim() } : {}
    });
  }

  submitSearch(): void {
    this.router.navigate([this.getSearchTargetRoute()], {
      queryParams: this.searchTerm.trim() ? { q: this.searchTerm.trim() } : {}
    });
  }

  private getSearchTargetRoute(): string {
    return this.router.url.startsWith('/home') ? '/home' : '/products';
  }

  useDefaultProfileImage(): void {
    this.picture = this.defaultProfileImage;
  }
}
