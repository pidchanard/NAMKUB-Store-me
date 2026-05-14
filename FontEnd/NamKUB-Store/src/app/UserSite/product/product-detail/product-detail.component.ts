import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Products } from '../../../model/products';
import { NAMKUBAPIService } from '../../../Service/namkub-api.service';
import { CartServiceService } from '../../../Service/cart-service.service';

@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product?: Products;
  relatedProducts: Products[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: NAMKUBAPIService,
    private cartService: CartServiceService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const productId = Number(params.get('id'));
      this.loadProduct(productId);
    });
  }

  addToCart(product: Products): void {
    this.cartService.addToCart(product);
  }

  goToDetail(product: Products): void {
    this.router.navigate(['/product-details', product.Product_ID]);
  }

  private loadProduct(productId: number): void {
    this.productService.getActiveProducts().subscribe(products => {
      this.product = products.find(product => product.Product_ID === productId);
      this.relatedProducts = products
        .filter(product => product.Product_ID !== productId)
        .slice(0, 3);
    });
  }
}
