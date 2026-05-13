import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartServiceService {
  private cart: any[] =[];
  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(private router: Router) {this.loadCartFromLocalStorage(); }
  addToCart(product: any) {
    // ตรวจสอบว่าสินค้ามีอยู่ในรถเข็นแล้ว
    const sameProduct = this.cart.find(p => p.Product_Name === product.Product_Name);
    const sameSize=this.cart.find(p=> p.Product_Size===product.Product_Size)
    if (sameProduct && sameSize) {
      // ถ้าสินค้ามีอยู่แล้วในรถเข็น ให้เพิ่มจำนวนสินค้า
      sameProduct.quantity += 1;
      Swal.fire({
        title: "เพิ่มจำนวน",
        text: "เพิ่มสินค้าลงรถเข็น",
        icon: "success"
      });
     
      
    } else {
      // ถ้าไม่มีสินค้าในรถเข็น ให้เพิ่มสินค้าใหม่พร้อมกำหนดจำนวนเริ่มต้นเป็น 1
      this.cart.push({ ...product, quantity: 1 });
      
      Swal.fire({
        title: "สำเร็จ",
        text: "คุณต้องการที่จะเลือกซื้อต่อไหม",
        
        showCancelButton: true,
        confirmButtonColor: "#75df72",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "สั่งซื้อทันที!",
        cancelButtonText: "หยิบใส่ตะกร้า",
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.goCart();
        }

      });
    }
    this.saveCartToLocalStorage();
  }
  getCart(){
    return this.cart;
  }
  clearCart(){

    this.cart=[];
    this.saveCartToLocalStorage();

  }
  public saveCartToLocalStorage(){
    if (!this.hasLocalStorage()) {
      return;
    }

    localStorage.setItem('cart',JSON.stringify(this.cart));// แปลงjson เก็บใน localStorage
    this.updateCartCount();
    
  }
  public loadCartFromLocalStorage(){
    if (!this.hasLocalStorage()) {
      return;
    }

    const savedCart = localStorage.getItem('cart');
    if (savedCart){
      this.cart =JSON.parse(savedCart);
    }
    this.updateCartCount();
  }
  
  public removeFromCart(product: any) {
  

    //loop checkout ว่า ตรงไหม
    const index = this.cart.findIndex(p => 
        p.Product_Name === product.Product_Name && p.product_Size === product.product_Size
    );

    console.log('Index found:', index); // ตรวจสอบค่า index

    if (index !== -1) {
      this.cart.splice(index, 1);
      
      this.saveCartToLocalStorage();
    } else {
      console.log('Product not found in cart');
    }
}
  goCart() {
  this.router.navigateByUrl('/cart')
  }

  private hasLocalStorage(): boolean {
    return typeof localStorage !== 'undefined';
  }

  private updateCartCount(): void {
    const count = this.cart.reduce((total, product) => total + Number(product.quantity || 1), 0);
    this.cartCountSubject.next(count);
  }

}
