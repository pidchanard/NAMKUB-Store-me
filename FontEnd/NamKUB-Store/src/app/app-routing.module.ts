import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './AdminSite/admin-login/admin-login.component';

import { AboutUsComponent } from './UserSite/about-us/about-us.component';
import { ContactComponent } from './UserSite/contact/contact.component';
import { HomeComponent } from './UserSite/home/home.component';
import { ProductComponent } from './UserSite/product/product.component';
import { UserLoginComponent } from './UserSite/user-login/user-login.component';
import { UserRegComponent } from './UserSite/user-reg/user-reg.component';
import { CartComponent } from './UserSite/cart/cart.component';
import { AdminHomeComponent } from './AdminSite/admin-home/admin-home.component';
import { OrderComponent } from './AdminSite/order/order.component';
import { EditproductComponent } from './AdminSite/editproduct/editproduct.component';
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
import { AuthGuard } from './auth.guard';
import { AdminRegComponent } from './AdminSite/admin-reg/admin-reg.component';
import { NoAccessComponent } from './no-access/no-access.component';
import { DashboardComponent } from './AdminSite/dashboard/dashboard.component';
import { StockComponent } from './AdminSite/stock/stock.component';
import { EditProfileComponent } from './UserSite/edit-profile/edit-profile.component';

//http://localhost:4200/adminhome
const routes: Routes = [
  {path: '',component: UserLoginComponent},
  {path: 'register',component: UserRegComponent},
  //{path: 'AdminRegister',component: AdminLoginComponent},
  {path: 'home',component:HomeComponent,canActivate: [AuthGuard],data:{roles:['admin','customer','Deliver']}},
  {path: 'products',component:ProductComponent,canActivate: [AuthGuard],data:{roles:['admin','customer','Deliver']}},
  {path: 'contact',component:ContactComponent,canActivate: [AuthGuard],data:{roles:['admin','customer','Deliver']}},
  {path: 'about-us',component:AboutUsComponent,canActivate: [AuthGuard],data:{roles:['admin','customer','Deliver']}},
  {path: 'adminRegister',component:AdminRegComponent},
  {path: 'cart',component:CartComponent},
  {path: 'adminhome',component:AdminHomeComponent,canActivate: [AuthGuard],data:{roles:['admin']}},
  {path: 'dashboard' ,component:DashboardComponent,canActivate: [AuthGuard],data:{roles:['admin']}},
  {path: 'order',component:OrderComponent,canActivate: [AuthGuard],data:{roles:['admin']}},
  {path: 'editproduct',component:EditproductComponent,canActivate: [AuthGuard],data:{roles:['admin']}},
  {path: 'stockmanage',component:StockComponent,canActivate: [AuthGuard],data:{roles:['admin']}},
  {path: 'memberlist',component:MemberlistComponent,canActivate: [AuthGuard],data:{roles:['admin']}},
  {path: 'product-details/singha1',component:Singha1Component},
  {path: 'product-details/singha2',component:Singha2Component},
  {path: 'product-details/singha3',component:Singha3Component},
  {path: 'product-details/crystal1',component:Crystal1Component},
  {path: 'product-details/crystal2',component:Crystal2Component},
  {path: 'product-details/crystal3',component:Crystal3Component},
  {path: 'product-details/nestle1',component:Nestle1Component},
  {path: 'product-details/nestle2',component:Nestle2Component},
  {path: 'product-details/nestle3',component:Nestle3Component},
  {path: 'product-details/minere1',component:Minere1Component},
  {path: 'product-details/minere2',component:Minere2Component},
  {path: 'product-details/:id',component:ProductDetailComponent,canActivate: [AuthGuard],data:{roles:['admin','customer','Deliver']}},
  
  {path: 'NoAccess',component:NoAccessComponent},
  {path: 'edit-profile' ,component:EditProfileComponent,canActivate: [AuthGuard],data:{roles:['customer']}},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
