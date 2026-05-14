import { Component, OnDestroy, OnInit } from '@angular/core';
import { Products } from '../../../model/products';
import { NAMKUBAPIService } from '../../../Service/namkub-api.service'; 
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router'
import { CartServiceService } from '../../../Service/cart-service.service';
@Component({
  selector: 'app-product-box',
  templateUrl: './product-box.component.html',
  styleUrl: './product-box.component.css'
})
export class ProductBoxComponent implements OnInit, OnDestroy {
  products: Products[] = [];
  searchText = '';
  private querySubscription?: Subscription;

  constructor(private productService: NAMKUBAPIService,
              private router:Router,
              private route: ActivatedRoute,
              private cartService:CartServiceService) { }

  ngOnInit(): void {
    this.querySubscription = this.route.queryParamMap.subscribe(params => {
      this.searchText = params.get('q')?.trim() || '';
      this.loadProducts();
    });
  }

  ngOnDestroy(): void {
    this.querySubscription?.unsubscribe();
  }
  
   addToCart(product: Products){
    this.cartService.addToCart(product);
   }

   goToDetail(product: Products): void {
    this.router.navigate(['/product-details', product.Product_ID]);
   }

   private loadProducts(): void {
    const request = this.searchText
      ? this.productService.searchProducts(this.searchText)
      : this.productService.getActiveProducts();

    request.subscribe(products => {
      const activeProducts = products.filter(product => product.Product_status === 'active');
      this.products = activeProducts;
    });
   }
}
