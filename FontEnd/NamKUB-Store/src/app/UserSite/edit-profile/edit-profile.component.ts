import { Router } from '@angular/router';
import { Component, EventEmitter, Inject, Input, Output, PLATFORM_ID } from '@angular/core';
import { NAMKUBAPIService } from '../../Service/namkub-api.service';
import { BehaviorSubject } from 'rxjs';
import { Users } from '../../model/products';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../../auth.service';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent {
  user = new BehaviorSubject<Users[]>([]);
  editprofileform:FormGroup;
  username: string | null = null;
  profilePreview: string = 'anya.jpg';

  constructor( private apiservice: NAMKUBAPIService,
                private http : HttpClient,
                private router:Router
                ,private fb: FormBuilder,
                private authService: AuthService,
                @Inject(PLATFORM_ID) private platformId: any,){
    this.editprofileform = this.fb.group({
      firstname: ['', [Validators.required, Validators.maxLength(50)]],
      lastname: ['', [Validators.required, Validators.maxLength(50)]],
      phone: ['', [Validators.required, Validators.maxLength(10)]],
      username: ['', [Validators.required, Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      picture: [null], 
    });
}

ngOnInit(): void {
  // ตรวจสอบว่ากำลังทำงานในเบราว์เซอร์
  if (isPlatformBrowser(this.platformId)) {
    const currentUser = this.authService.getCurrentUser();
    this.username = currentUser?.username || this.authService.getUsername();
    this.profilePreview = currentUser?.picture || this.authService.getPicture() || 'anya.jpg';
    this.editprofileform.patchValue({
      firstname: currentUser?.firstname || '',
      lastname: currentUser?.lastname || '',
      phone: currentUser?.phone || '',
      username: this.username,
      email: currentUser?.email || '',
      picture: this.profilePreview
    });

  }
}

onSubmit(){
  if(this.editprofileform.valid){
    const formData = {
      firstname:this.editprofileform.value.firstname,
      lastname:this.editprofileform.value.lastname,
      phone:this.editprofileform.value.phone,
      username:this.editprofileform.value.username,
      email:this.editprofileform.value.email,
      picture: this.editprofileform.value.picture
      
    };
    this.apiservice.updateUser(formData).subscribe({
    next:(response)=> {
      console.log('Profile saved successfully!',response);
      this.authService.setProfileData(formData);
      Swal.fire({
        title: 'Saved!',
        text: 'Profile saved in this browser.',
        icon: 'success',
        timer: 900,
        showConfirmButton: false
      }).then(() => {
        this.router.navigate(['/home']);
      });
     
    },
    error:(error) =>{
      console.error('Error save profile',error);
      console.log(this.editprofileform.errors);
      console.log(this.editprofileform.value);
    }
  });
  }else{
    console.log('Form is not valid');
    console.log(this.editprofileform.errors);
    console.log(this.editprofileform.value);
    this.editprofileform.markAllAsTouched();
  }
}
  @Input() users: { firstname?: string; lastname?: string; phone?: string; username?: string; email?: string } = {}; 
  @Output() onConfirm = new EventEmitter<any>(); 

  saveProfile(){
    if (this.users.firstname && this.users.lastname && this.users.phone && this.users.username && this.users.email) {
      this.onConfirm.emit(this.users);
  }
  }
  resetForm(){
    const currentUser = this.authService.getCurrentUser();
    this.profilePreview = currentUser?.picture || 'anya.jpg';
    this.editprofileform.reset({
      firstname: currentUser?.firstname || '',
      lastname: currentUser?.lastname || '',
      phone: currentUser?.phone || '',
      username: currentUser?.username || this.username,
      email: currentUser?.email || '',
      picture: this.profilePreview
    });
  }

  editprofile(){
    this.editprofileform.patchValue({
      
      firstname: this.users.firstname,
      lastname: this.users.lastname,
      phone: this.users.phone,
      username: this.username,
      email: this.users.email,
      
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.profilePreview = String(reader.result);
        this.editprofileform.patchValue({
          picture: reader.result
        });
      };

      reader.readAsDataURL(file);
    }
  }

}

  
  // saveProfile(): void {
  //   alert('Profile saved successfully!\n' +
  //     `First Name: ${this.user.firstname}\n` +
  //     `Last Name: ${this.user.lastname}\n` +
  //     `Phone: ${this.user.phone}\n` +
  //     `Username: ${this.user.username}\n` +
  //     `Email: ${this.user.email}`);
  // }

  // resetForm(): void {
  //   this.user = {
  //     firstname: 'Jane',
  //     lastname: 'Doe',
  //     phone: '0123456789',
  //     username: 'johndoe',
  //     email: 'janedoe@example.com',
  //     password: 'password1234'
  //   };
  //   alert('Form reset to default values!');
  // }

