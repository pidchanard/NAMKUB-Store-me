import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartServiceService {
  private cart: any[] = [];
  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(private router: Router) {
    this.loadCartFromLocalStorage();
  }

  addToCart(product: any): void {
    const sameProduct = this.cart.find(item =>
      item.Product_Name === product.Product_Name && item.Product_Size === product.Product_Size
    );

    if (sameProduct) {
      sameProduct.quantity += 1;
      this.showCartToast();
    } else {
      this.cart.push({ ...product, quantity: 1 });
      this.showCartChoice();
    }

    this.saveCartToLocalStorage();
  }

  getCart(): any[] {
    return this.cart;
  }

  clearCart(): void {
    this.cart = [];
    this.saveCartToLocalStorage();
  }

  public saveCartToLocalStorage(): void {
    if (!this.hasLocalStorage()) {
      return;
    }

    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.updateCartCount();
  }

  public loadCartFromLocalStorage(): void {
    if (!this.hasLocalStorage()) {
      return;
    }

    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
    }
    this.updateCartCount();
  }

  public removeFromCart(product: any): void {
    const index = this.cart.findIndex(item =>
      item.Product_Name === product.Product_Name && item.Product_Size === product.Product_Size
    );

    if (index !== -1) {
      this.cart.splice(index, 1);
      this.saveCartToLocalStorage();
    }
  }

  goCart(): void {
    this.router.navigateByUrl('/cart');
  }

  private showCartToast(): void {
    Swal.fire({
      title: 'เพิ่มจำนวนแล้ว',
      text: 'เพิ่มสินค้าในรถเข็นเรียบร้อย',
      icon: 'success',
      toast: true,
      position: 'top-end',
      timer: 1300,
      showConfirmButton: false,
      customClass: {
        popup: 'namkub-toast'
      }
    });
  }

  private showCartChoice(): void {
    const isDarkMode = this.hasDocument() && document.body.classList.contains('dark-mode');

    Swal.fire({
      title: 'เพิ่มลงรถเข็นแล้ว',
      text: 'จะไปตะกร้าหรือเลือกสินค้าต่อ?',
      icon: 'success',
      width: 420,
      padding: '24px',
      background: isDarkMode ? '#171629' : '#ffffff',
      color: isDarkMode ? '#f8fbff' : '#172033',
      backdrop: isDarkMode ? 'rgba(3, 4, 20, 0.42)' : 'rgba(17, 35, 64, 0.2)',
      showCancelButton: true,
      confirmButtonText: 'ไปตะกร้า',
      cancelButtonText: 'เลือกต่อ',
      reverseButtons: true,
      buttonsStyling: false,
      customClass: {
        popup: 'namkub-swal-popup',
        title: 'namkub-swal-title',
        htmlContainer: 'namkub-swal-text',
        actions: 'namkub-swal-actions',
        confirmButton: 'namkub-swal-confirm',
        cancelButton: 'namkub-swal-cancel'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.goCart();
      }
    });
  }

  private hasLocalStorage(): boolean {
    return typeof localStorage !== 'undefined';
  }

  private hasDocument(): boolean {
    return typeof document !== 'undefined';
  }

  private updateCartCount(): void {
    const count = this.cart.reduce((total, product) => total + Number(product.quantity || 1), 0);
    this.cartCountSubject.next(count);
  }
}
