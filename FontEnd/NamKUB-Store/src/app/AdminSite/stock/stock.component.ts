import { Component, EventEmitter, Input, Output,OnInit } from '@angular/core';
import {  Restock, Stock } from '../../model/products';
import { BehaviorSubject, Observable } from 'rxjs';
import { NAMKUBAPIService } from '../../Service/namkub-api.service';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.css'
})
export class StockComponent {
  searchQuery: string = '';
  searchdate: string = '';
  searchQuery1: string = '';
  stocks = new BehaviorSubject<Stock[]>([]);
  restocks = new BehaviorSubject<Restock[]>([]);
  RestockForm: FormGroup;
  selectedStock: number | null;
  limit: number = 6;  
  page: number = 1; 


  constructor( private apiservice: NAMKUBAPIService,
               private fb : FormBuilder,
               private http : HttpClient,
               private route: ActivatedRoute
  ){
    this.RestockForm = this.fb.group({
      Restock_Quantity: [null, [Validators.required]],
      Restock_Unitprice: [null, [Validators.required]],
      Stock_ID:[null]
    })
  }




  ngOnInit(): void{
    this.reloadStocks();
    this.reloadRestock();
    this.route.queryParamMap.subscribe(params => {
      this.searchQuery1 = params.get('q') || '';
      this.searchQuery1 ? this.searchstock() : this.reloadStocks();
    });
  }

  @Input() isModalOpen: boolean = false;
  @Output() onClose = new EventEmitter<void>(); 
  @Output() onConfirm = new EventEmitter<any>(); 
  
  reloadStocks(){
    this.apiservice.getAllStockView().subscribe((stocks) =>{
      this.stocks.next(stocks); 
    })
  }
  reloadRestock(){
    this.apiservice.getAllRestock().subscribe((restocks) =>{
      this.restocks.next(restocks);
    })
  }

  RestockModal(stock : Stock){
    this.isModalOpen = true;

    this.selectedStock = stock.Stock_ID;

    this.RestockForm.patchValue({

      Restock_Quantity: stock.Stock_Quantity,
      Restock_Unitprice: stock.Sup_Unitprice,
      Stock_ID: stock.Stock_ID  
    });
    
  }
  closeRestockMoal(){
    this.isModalOpen = false;
  }

  onSubmit(){
    if(this.RestockForm.valid){
      const formData = {
        Restock_Quantity: this.RestockForm.value.Restock_Quantity,
        Restock_Unitprice: this.RestockForm.value.Restock_Unitprice,
        Stock_ID: this.RestockForm.value.Stock_ID
      };
      this.apiservice.addRestock(formData).subscribe({
        next: (response) => {
          console.log('Restock successfully:', response);
          this.showPopup(); 
          this.closeModal();
          this.reloadRestock();
        }
      })
    }
  }
  closeModal() {
    this.RestockForm.reset();
    this.onClose.emit();
    this.isModalOpen = false;
  }
  showPopup() {
    Swal.fire({
      title: "Nice!",
      text: "Restock Successfully!",
      icon: "success"
    });
  }
  reloadPage() {
    setTimeout(() => {
      window.location.href = window.location.href;
    }, 1500)
  }

  searchRestock(){
    console.log(`Searching for RestockHistory : ${this.searchQuery}`);
    this.apiservice.searchRestocks(this.searchQuery, this.searchdate)
      .subscribe({
        next: (response: Restock[]) => {
          console.log('Search result:', response);
          this.restocks.next(response);
        },
        error: (error) => {
          console.error('Error fetching products:', error);  
        }
      });

  }

  searchstock(){
    console.log(`Searching for StockHistory : ${this.searchQuery1}`);
    this.apiservice.searchStocks(this.searchQuery1)
      .subscribe({
        next: (response: Stock[]) => {
          console.log('Search result:', response);
          this.stocks.next(response);
        },
        error: (error) => {
          console.error('Error fetching products:', error);  
        }
      });

  }
  
}
