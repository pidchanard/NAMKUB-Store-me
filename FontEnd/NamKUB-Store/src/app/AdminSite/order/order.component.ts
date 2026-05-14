import { Component } from '@angular/core';
import { NAMKUBAPIService } from '../../Service/namkub-api.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Orders } from '../../model/products';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent {
  order = new BehaviorSubject<Orders[]>([]);
  searchQuery1: any;

  constructor( private apiservice: NAMKUBAPIService,
    private http : HttpClient,
    private route: ActivatedRoute
){}

  ngOnInit(): void{
    this.route.queryParamMap.subscribe(params => {
      this.searchQuery1 = params.get('q') || '';
      this.searchQuery1 ? this.searchOrder() : this.reloadUsers();
    });
  }

  reloadUsers(){
  this.apiservice.getAllOrders().subscribe((order) =>{
  this.order.next(order);
  })
  }

  searchOrder(){
    console.log(`Searching for Member : ${this.searchQuery1}`);
    this.apiservice.searchOrders(this.searchQuery1)
      .subscribe({
        next: (response: Orders[]) => {
          console.log('Search result:', response);
          this.order.next(response);
        },
        error: (error) => {
          console.error('Error fetching products:', error);  
        }
      });

  }

}
