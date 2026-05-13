import { Component } from '@angular/core';
import { Products } from '../../../model/products';
import { NAMKUBAPIService } from '../../../Service/namkub-api.service'; 
import { map, Observable, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router'
import { CartServiceService } from '../../../Service/cart-service.service';
@Component({
  selector: 'app-product-box',
  templateUrl: './product-box.component.html',
  styleUrl: './product-box.component.css'
})
export class ProductBoxComponent {
  products: Observable<Products[]> | undefined;
  searchText = '';

  constructor(private productService: NAMKUBAPIService,
              private router:Router,
              private route: ActivatedRoute,
              private cartService:CartServiceService) { }

  ngOnInit(): void {
    this.products = this.route.queryParamMap.pipe(
      switchMap(params => {
        this.searchText = params.get('q')?.trim() || '';
        return this.searchText
          ? this.productService.searchProducts(this.searchText)
          : this.productService.getActiveProducts();
      }),
      map(products => products.filter(product => product.Product_status === 'active'))
    );
  }
  
   addToCart(product: any){
    this.cartService.addToCart(product);
   }
}
