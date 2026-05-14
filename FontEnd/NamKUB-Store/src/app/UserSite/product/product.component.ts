import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Products } from '../../model/products';
import { CartServiceService } from '../../Service/cart-service.service';
import { NAMKUBAPIService } from '../../Service/namkub-api.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit, OnDestroy {
  products: Products[] = [];
  displayProducts: Products[] = [];
  searchText = '';
  private querySubscription?: Subscription;

  constructor(
    private apiService: NAMKUBAPIService,
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartServiceService
  ) {}

  ngOnInit(): void {
    this.querySubscription = this.route.queryParamMap.subscribe(params => {
      this.searchText = params.get('q')?.trim() || '';
      this.loadProducts();
    });
  }

  ngOnDestroy(): void {
    this.querySubscription?.unsubscribe();
  }

  addToCart(product: Products): void {
    this.cartService.addToCart(product);
  }

  goToDetail(product: Products): void {
    this.router.navigate(['/product-details', product.Product_ID]);
  }

  private loadProducts(): void {
    const request = this.searchText
      ? this.apiService.searchProducts(this.searchText)
      : this.apiService.getActiveProducts();

    request.subscribe({
      next: products => {
        const activeProducts = products.filter(product => product.Product_status === 'active');
        this.products = activeProducts;
        this.displayProducts = [...this.products];
      },
      error: () => {
        this.products = [];
        this.displayProducts = [...this.products];
      }
    });
  }
}
