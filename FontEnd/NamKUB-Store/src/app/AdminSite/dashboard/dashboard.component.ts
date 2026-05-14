import { Component, OnInit } from '@angular/core';
import { Alltime, BestSale, Summary } from '../../model/products';
import { NAMKUBAPIService } from '../../Service/namkub-api.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public AlltimeSum: Alltime[] = []; 
  public bestsale: BestSale[] = [];  
  selectedMonth = 1;

  // BehaviorSubject เพื่อใช้สำหรับเก็บและแชร์ข้อมูล Summary
  public summaries = new BehaviorSubject<Summary[]>([]);

  constructor(private apiService: NAMKUBAPIService) {}

  ngOnInit() {
    this.loadSummaries();
    this.loadAlltime();
    this.loadBestsale();
  }

  loadSummaries() {
    this.apiService.getSummary().subscribe(
      data => {
        this.summaries.next(data);  // อัพเดตข้อมูลใน BehaviorSubject
      },
      error => {
        console.error('Error fetching summaries', error);
      }
    );
  }

  loadAlltime() {
    this.apiService.getAlltime().subscribe(
      data => {
        this.AlltimeSum = data;
      },
      error => {
        console.error('Error fetching all-time summaries', error);
      }
    );
  }

  loadBestsale() {
    this.apiService.getBestSale().subscribe(
      data => {
        this.bestsale = data;
      },
      error => {
        console.error('Error fetching best sale summaries', error);
      }
    );
  }

  submitMonth() {
    console.log(`Searching for summary data for month: ${this.selectedMonth}`);
    this.apiService.searchSummariesByMonth(this.selectedMonth).subscribe({
      next: (response: Summary[]) => {
        console.log('Data received:', response);
        this.summaries.next(response); // อัพเดตข้อมูลใน BehaviorSubject เมื่อมีการค้นหาเดือน
      },
      error: (error) => {
        console.error('Error fetching summary data:', error);
      }
    });
  }
  reloadPage() { window.location.href = window.location.href; }
}
