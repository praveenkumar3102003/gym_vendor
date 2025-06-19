// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Router, RouterModule } from '@angular/router';
// import { AuthService } from '../../services/auth.service';
// import { NewUserCredentials } from '../../models/user.model';

// @Component({
//   selector: 'app-register',
//   standalone: true,
//   imports: [CommonModule, FormsModule, RouterModule],
//   templateUrl: './register.component.html',
//   styleUrls: ['./register.component.css']
// })
// export class RegisterComponent {
//   registerData: NewUserCredentials = {
//     name: '',
//     role: 'Student',
//     email: '',
//     password: ''
//   };

//   confirmPassword = '';
//   isLoading = false;
//   errorMessage = '';
//   successMessage = '';

//   constructor(private authService: AuthService, private router: Router) {}

//   onSubmit(): void {
//     if (!this.registerData.name || !this.registerData.email || !this.registerData.password) {
//       this.errorMessage = 'Please fill in all fields';
//       return;
//     }

//     if (this.registerData.password !== this.confirmPassword) {
//       this.errorMessage = 'Passwords do not match';
//       return;
//     }

//     if (this.registerData.password.length < 6) {
//       this.errorMessage = 'Password must be at least 6 characters long';
//       return;
//     }

//     this.isLoading = true;
//     this.errorMessage = '';

//     this.authService.register(this.registerData).subscribe({
//       next: (response) => {
//         this.isLoading = false;
//         this.successMessage = 'Registration successful! Please log in.';
//         setTimeout(() => {
//           this.router.navigate(['/login']);
//         }, 2000);
//       },
//       error: (error) => {
//         this.isLoading = false;
//         this.errorMessage = error.error?.detail || 'Registration failed. Please try again.';
//       }
//     });
//   }
// }

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NewUserCredentials } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerData: NewUserCredentials = {
    name: '',
    role: 'student', // lowercase (recommended for consistency)
    email: '',
    password: ''
  };

  confirmPassword = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (!this.registerData.name || !this.registerData.email || !this.registerData.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    if (this.registerData.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    if (this.registerData.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Ensure role is lowercase for backend compatibility
    this.registerData.role = this.registerData.role.toLowerCase();

    this.authService.register(this.registerData).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Registration successful! Please log in.';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.detail || 'Registration failed. Please try again.';
      }
    });
  }
}
