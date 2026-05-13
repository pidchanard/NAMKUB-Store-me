import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Users } from '../../model/products';
import { NAMKUBAPIService } from '../../Service/namkub-api.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-memberlist',
  templateUrl: './memberlist.component.html',
  styleUrl: './memberlist.component.css'
})
export class MemberlistComponent {
  user = new BehaviorSubject<Users[]>([]);
  searchQuery1: any;

        constructor( private apiservice: NAMKUBAPIService,
                     private http : HttpClient
        ){}
        
        ngOnInit(): void{
          this.reloadUsers();
        }

        reloadUsers(){
          this.apiservice.getAllUsers().subscribe((user) =>{
            this.user.next(user);
          })
        }
        
        searchMember(){
          console.log(`Searching for Member : ${this.searchQuery1}`);
          this.apiservice.searchUsers(this.searchQuery1)
            .subscribe({
              next: (response: Users[]) => {
                console.log('Search result:', response);
                this.user.next(response);
              },
              error: (error) => {
                console.error('Error fetching products:', error);  
              }
            });
      
        }


}
