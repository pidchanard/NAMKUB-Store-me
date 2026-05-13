import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Products, Supplier } from '../../model/products'; 
import { NAMKUBAPIService } from '../../Service/namkub-api.service';
import { Observable } from 'rxjs/internal/Observable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-editproduct',
  templateUrl: './editproduct.component.html',
  styleUrls: ['./editproduct.component.css']
})
export class EditproductComponent {
  products$ = new BehaviorSubject<Products[]>([]);
  addproductform: FormGroup;
  UpdateProductform: FormGroup;
  AddSupplierform : FormGroup;
  selectedProductId: number | null = null;
  searchQuery: string = '';
  suppliers$: Observable<Supplier[]>;
  
  constructor(private fb: FormBuilder, 
              private http: HttpClient, 
              private router: Router, 
              private productService: NAMKUBAPIService) {

    this.addproductform = this.fb.group({
      Product_Name: ['', Validators.required],
      Product_Picture: [null], 
      Product_Size: [null, [Validators.required, Validators.min(330)]],
      Product_Price: [null, [Validators.required, Validators.min(1)]],
      Sup_ID: [null, Validators.required] ,
      StockQuantity:[null, Validators.required],
      SupUnitPrice: [null, Validators.required]
    });
    this.UpdateProductform = this.fb.group({
      Product_Name: ['', Validators.required],
      Product_Picture: [null], 
      Product_Size: [null, [Validators.required, Validators.min(330)]],
      Product_Price: [null, [Validators.required, Validators.min(1)]],
      Sup_ID: [null, Validators.required],
      Product_status : [null]
      
    });
    this.AddSupplierform = this.fb.group({
      Sup_Name: ['', Validators.required]
    });
  }
  showPopup() {
    Swal.fire({
      title: "Nice!",
      text: "Product Add Successfully!",
      icon: "success"
    });
  }
  showPopup1() {
    Swal.fire({
      title: "Nice!",
      text: "Product Update Successfully!",
      icon: "success"
    });
  }
  showPopup2() {
    Swal.fire({
      title: "Nice!",
      text: "Supplier Add Successfully!",
      icon: "success"
    });
  }

  closeModal() {
    this.addproductform.reset();
    this.onClose.emit();
    this.isModalOpen = false;
  }
  closeModal1() {
    this.addproductform.reset();
    this.onClose.emit();
    this.isModalOpen1 = false;
  }

  closeModal2() {
    this.AddSupplierform.reset();
    this.onClose.emit();
    this.isModalOpen2 = false;
  }
  
  onSubmit() {
    
    if (this.addproductform.valid) {
      const formData = {
        Product_Name: this.addproductform.value.Product_Name,
        Product_Picture: this.addproductform.value.Product_Picture,
        Product_Size: this.addproductform.value.Product_Size,
        Product_Price: this.addproductform.value.Product_Price,
        Sup_ID: this.addproductform.value.Sup_ID,
        StockQuantity: this.addproductform.value.StockQuantity,
        SupUnitPrice: this.addproductform.value.SupUnitPrice
      };
    
      this.productService.addProduct(formData).subscribe({
        next: (response) => {
          console.log('Product added successfully:', response);
          this.showPopup(); // เรียกใช้ฟังก์ชันแสดงผลสำเร็จ
          this.closeModal();
          this.reloadProducts();
        },
        error: (error) => {
          console.error('Error adding product:', error);
          console.log(this.addproductform.errors);
          console.log(this.addproductform.value);
        }
      });
    } else {
      console.log('Form is not valid');
      console.log(this.addproductform.errors);
      console.log(this.addproductform.value);
    }
  }

  @Input() isModalOpen: boolean = false;
  @Input() isModalOpen1: boolean = false;
  @Input() isModalOpen2: boolean = false;
  @Input() product: { Product_Name?: string; Product_Size?: string; Product_Price?: number; Sup_ID?: number; Product_Picture?: File | null } = {}; 

  @Output() onClose = new EventEmitter<void>(); 
  @Output() onConfirm = new EventEmitter<any>(); 

  ngOnInit(): void {
    this.reloadProducts();
    this.loadSuppliers();
  }

  openAddProductModal() {
    this.isModalOpen = true;
  }


  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.addproductform.patchValue({
        Product_Picture: input.files[0].name
      });
    }
  }


  confirm() {
    if (this.product.Product_Name && this.product.Product_Size && this.product.Product_Price && this.product.Sup_ID) {
      this.onConfirm.emit(this.product);
      this.closeModal();
    }
  }

  updateProduct(Product_ID: number) {
    if (this.addproductform.valid) {
      const formData = {
        Product_Name: this.addproductform.value.Product_Name,
        Product_Picture: this.addproductform.value.Product_Picture,
        Product_Size: this.addproductform.value.Product_Size,
        Product_Price: this.addproductform.value.Product_Price,
        Sup_ID: this.addproductform.value.Sup_ID,
        
      };

      this.productService.updateProduct(Product_ID, formData).subscribe({
        next: () => {
          console.log('Product updated successfully');
          console.log('Product updated successfully');
          this.showPopup;
          
          this.closeModal(); // ปิดโมดอลหลังจากอัปเดตเสร็จ
          this.selectedProductId = null; // รีเซ็ต selectedProductId
        },
        error: (error) => {
          console.error('Error updating product:', error);
        }
      });
    }
  }
  deleteProduct(Product_ID: any) {

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true
    }).then((result) => {
      
      if (result.isConfirmed) {
        this.productService.deleteProduct(Product_ID).subscribe({
          next: () => {
            console.log('Product deleted successfully');
            swalWithBootstrapButtons.fire({
              title: "Deleted!",
              text: "Product has been deleted.",
              icon: "success"
            });
            
            this.reloadProducts();
          },
          error: (error) => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Error deleting product!",
            });
            console.error('Error deleting product:', error);
          }    });
        
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Product is safe :)",
          icon: "error"
        });
      }
    });

 
  
  }

  editProduct(product: Products) {
    this.isModalOpen1 = true; // เปิด modal สำหรับการแก้ไข

    // เก็บ Product ID ที่เลือกเพื่อใช้ในอนาคต เช่นการอัปเดต
    this.selectedProductId = product.Product_ID; 

    // เติมข้อมูลสินค้าที่เลือกลงในฟอร์ม UpdateProductform
    this.UpdateProductform.patchValue({
      Product_Name: product.Product_Name,
      Product_Picture: product.Product_Picture,
      Product_Size: product.Product_Size,
      Product_Price: product.Product_Price,
      Sup_ID: product.Sup_ID,
      Product_status : product.Product_status
      
    });
  }


  
  onUpdate() {
    if (this.UpdateProductform.valid && this.selectedProductId) {
      const formData = {
        Product_Name: this.UpdateProductform.value.Product_Name,
        Product_Picture: this.UpdateProductform.value.Product_Picture,
        Product_Size: this.UpdateProductform.value.Product_Size,
        Product_Price: this.UpdateProductform.value.Product_Price,
        Sup_ID: this.UpdateProductform.value.Sup_ID,
        Product_status : this.UpdateProductform.value.Product_status
      };

      // ทำการอัปเดตสินค้าผ่าน API โดยใช้ Product_ID ที่เลือกไว้
      this.productService.updateProduct(this.selectedProductId, formData).subscribe({
        next: () => {
          console.log('Product updated successfully');
          this.showPopup1(); 
          this.closeModal1();
          this.reloadProducts(); 
          this.selectedProductId = null; // รีเซ็ต Product ID
        
        },
        error: (error) => {
          console.error('Error updating product:', error);
        }
      });
    }
}
  searchProducts() {
    console.log(`Searching for products with query: ${this.searchQuery}`);
    this.productService.searchProducts(this.searchQuery)
      .subscribe({
        next: (response: Products[]) => {
          console.log('Search result:', response); 
          this.products$.next(response);  
        },
        error: (error) => {
          console.error('Error fetching products:', error);  
        }
      });
  }
  
  
  
  reloadProducts() {
    this.productService.getAllProduct().subscribe((products) => {
      this.products$.next(products);
    });
  }
  

  loadSuppliers() {
    this.suppliers$ = this.productService.getSuppliers(); // ดึงข้อมูล Supplier จาก API และเก็บไว้ใน Observable
  }

  openAddSupplierModal(){
    this.isModalOpen2 = true;
  }

  onSupplier(){
    if (this.AddSupplierform.valid) {
      const formData = {
        
        Sup_Name : this.AddSupplierform.value.Sup_Name
      };
    
      this.productService.addSupplier(formData).subscribe({
        next: (response) => {
          console.log('Supplier added successfully:', response);
          this.showPopup2(); // เรียกใช้ฟังก์ชันแสดงผลสำเร็จ
          this.closeModal2();
          this.loadSuppliers();
        },
        error: (error) => {
          console.error('Error adding supplier:', error);
          console.log(this.AddSupplierform.errors);
          console.log(this.AddSupplierform.value);
        }
      });
    } else {
      console.log('Form is not valid');
      console.log(this.AddSupplierform.errors);
      console.log(this.AddSupplierform.value);
    }
  }

}

  
  
  
 
  
