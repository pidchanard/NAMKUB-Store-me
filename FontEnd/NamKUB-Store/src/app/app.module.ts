import { NgModule } from '@angular/core'; 
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatButtonModule}from '@angular/material/button';
import{MatIconModule} from '@angular/material/icon';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { MatBadgeModule } from '@angular/material/badge';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { DataTablesModule } from "angular-datatables";


import { AppComponent } from './app.component';
import { AboutUsComponent } from './UserSite/about-us/about-us.component';
import { ContactComponent } from './UserSite/contact/contact.component';
import { FooterComponent } from './UserSite/footer/footer.component';
import { HeaderUserComponent } from './UserSite/header-user/header-user.component';
import { HomeComponent } from './UserSite/home/home.component';
import { ProductComponent } from './UserSite/product/product.component';
import { UserLoginComponent } from './UserSite/user-login/user-login.component';
import { UserRegComponent } from './UserSite/user-reg/user-reg.component';
import { CartComponent } from './UserSite/cart/cart.component';
import { AdminHomeComponent } from './AdminSite/admin-home/admin-home.component';
import { EditproductComponent } from './AdminSite/editproduct/editproduct.component';
import { OrderComponent } from './AdminSite/order/order.component';
import { MemberlistComponent } from './AdminSite/memberlist/memberlist.component';
import { Singha1Component } from './UserSite/Product-details/singha1/singha1.component';
import { Singha2Component } from './UserSite/Product-details/singha2/singha2.component';
import { Singha3Component } from './UserSite/Product-details/singha3/singha3.component';
import { Crystal1Component } from './UserSite/Product-details/crystal1/crystal1.component';
import { Crystal2Component } from './UserSite/Product-details/crystal2/crystal2.component';
import { Crystal3Component } from './UserSite/Product-details/crystal3/crystal3.component';
import { Nestle1Component } from './UserSite/Product-details/nestle1/nestle1.component';
import { Nestle2Component } from './UserSite/Product-details/nestle2/nestle2.component';
import { Nestle3Component } from './UserSite/Product-details/nestle3/nestle3.component';
import { Minere1Component } from './UserSite/Product-details/minere1/minere1.component';
import { Minere2Component } from './UserSite/Product-details/minere2/minere2.component';
import { ProductBoxComponent } from './UserSite/product/product-box/product-box.component';
import { ProductDetailComponent } from './UserSite/product/product-detail/product-detail.component';
import { AdminRegComponent } from './AdminSite/admin-reg/admin-reg.component';
import { AuthService } from './auth.service';
import { NAMKUBAPIService } from './Service/namkub-api.service';

import { NoAccessComponent } from './no-access/no-access.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DashboardComponent } from './AdminSite/dashboard/dashboard.component';

import { StockComponent } from './AdminSite/stock/stock.component';
import { EditProfileComponent } from './UserSite/edit-profile/edit-profile.component';
  
@NgModule({
  declarations: [
    AppComponent,
    UserLoginComponent,
    UserRegComponent,
    AboutUsComponent,
    ProductComponent,
    ContactComponent,
    FooterComponent,
    HeaderUserComponent,
    HomeComponent,
    CartComponent,
    AdminHomeComponent,
    EditproductComponent,
    OrderComponent,
    MemberlistComponent,
    Singha1Component,
    Singha2Component,
    Singha3Component,
    Crystal1Component,
    Crystal2Component,
    Crystal3Component,
    Nestle1Component,
    Nestle2Component,
    Nestle3Component,
    Minere1Component,
    Minere2Component,
    ProductBoxComponent,
    ProductDetailComponent,
    AdminRegComponent,
    NoAccessComponent,
    DashboardComponent,
    StockComponent,
    EditProfileComponent,
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatBadgeModule,
    DataTablesModule
  ],
  providers: [
    provideClientHydration(),AuthService,NAMKUBAPIService, provideAnimationsAsync(),
    provideHttpClient(withFetch())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
