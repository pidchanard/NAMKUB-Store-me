import { Component } from '@angular/core';
import { CartServiceService } from '../../Service/cart-service.service';
import * as bootstrap from 'bootstrap';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth.service';
import Swal from 'sweetalert2';
import { NAMKUBAPIService } from '../../Service/namkub-api.service';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cartProducts: any[] = [];
  totalPrice = 0;
  isSelectAllChecked: boolean = false;
  username: string | null = null;
  userAddress: string = '';
  isAddressModalOpen: boolean = false;

  constructor(private http: HttpClient, private cartService: CartServiceService, private authService: AuthService, private apiService: NAMKUBAPIService) { }

  ngOnInit() {
    this.username = this.authService.getUsername();
    console.log('Username:', this.username);
    // Fetch products from the cart service and initialize quantity if not set
    this.cartProducts = this.cartService.getCart();
    this.cartProducts.forEach(product => {
      if (!product.quantity) {
        product.quantity = 1; // Initialize quantity to 1 if not already set
      }
    });
    this.updateTotal();
    this.username = this.authService.getUsername();
  }

  increaseQuantity(product: any) {
    product.quantity++;
    this.updateTotal();  // Recalculate the total price
    this.cartService.saveCartToLocalStorage();
  }

  decreaseQuantity(product: any) {
    if (product.quantity > 1) {
      product.quantity--;
      this.updateTotal();  // Recalculate the total price
      this.cartService.saveCartToLocalStorage();
    }
  }

  updateTotal() {
    this.totalPrice = this.cartProducts.reduce((acc, product) => {
      return acc + (product.Product_Price * product.quantity);
    }, 0);
  }
  removeProduct(product: any) {
    console.log('1')
    this.cartService.removeFromCart(product);
    console.log('2')
    this.cartProducts = this.cartService.getCart();
    console.log('3')
    this.updateTotal(); //update price
    console.log('4')
  }
 
  isModalOpen: boolean = false;
  openModal() {
    this.isModalOpen = true;
    console.log('dialog box popup')
  }
  closeModal() {
    this.isModalOpen = false;
  }
  getTotalPrice(): number {
    return this.cartProducts.reduce((total, product) => total + (product.Product_Price * product.quantity), 0);
  }
  confirmOrder() {
    const orderData = {
      username: this.username,
      totalPrice: this.totalPrice,
      Cus_Address:this.userAddress,
      item: this.cartProducts.map(product => ({
        Product_ID: product.Product_ID,
        Product_Price: product.Product_Price,
        Order_Quantity: product.quantity,
        Subtotal_Price: product.Product_Price * product.quantity
      }))
    };
    console.log('Order Data:', orderData);
    this.apiService.addOrder(orderData)
      .subscribe({
        next: (response) => {
          console.log('order placed successfully', response);
          this.closeModal();
          this.cartService.clearCart();
          this.cartProducts = [];
          this.totalPrice = 0;
          this.cartService.saveCartToLocalStorage();
          Swal.fire({
            title: 'สั่งซื้อสำเร็จ!',
            text: 'ขอบคุณที่สั่งซื้อสินค้ากับเรา',
            icon: 'success',
            confirmButtonText: 'ตกลง'
          });
        
        },
        error: (error) => {
          console.error('Error placing order', error);
          
            console.error(' not enough quantity')
            Swal.fire({
              title: "สั่งซื้อไม้่สำเร็จ",
              text: "มีสินค้าในคลังไม่เพียงพอ",       
              icon: "error"
             
            });
         
        }
      })
  }
  removeAll(){
    this.cartService.clearCart();
    this.cartProducts = [];
    this.totalPrice = 0;
    Swal.fire({
      title: "ลบสินค้าทั้งหมด",
      text: "ลบสินค้าจากรถเข็นสำเร็จ",       
      icon: "success"
     
    });
     this.cartService.saveCartToLocalStorage();
  }

  closeAddressModal() {
    this.isAddressModalOpen = false;
  }
  openAddressModal() {
    this.isAddressModalOpen = true;
  }

  checkAddress() {
    if (this.userAddress.trim() === '') {
      this.openAddressModal();
    } else {
      this.openModal();
    }
  }
  saveAddress() {
    if (this.userAddress.trim() === '') {
      Swal.fire({
        title: "กรุณากรอกที่อยู่",
        text: "กรุณากรอกที่อยู่ของคุณ",       
        icon: "info"
       
      });
    } else {
      this.closeAddressModal();
      this.openModal();
    }
  }
}
