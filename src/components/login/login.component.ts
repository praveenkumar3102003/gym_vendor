// // import { Component } from '@angular/core';
// // import { CommonModule } from '@angular/common';
// // import { FormsModule } from '@angular/forms';
// // import { Router, RouterModule } from '@angular/router';
// // import { AuthService } from '../../services/auth.service';
// // import { UserLogin } from '../../models/user.model';

// // @Component({
// //   selector: 'app-login',
// //   standalone: true,
// //   imports: [CommonModule, FormsModule, RouterModule],
// //   templateUrl: './login.component.html',
// //   styleUrls: ['./login.component.css']
// // })
// // export class LoginComponent {
// //   loginData: UserLogin = {
// //     email: '',
// //     password: ''
// //   };

// //   isLoading = false;
// //   errorMessage = '';

// //   constructor(private authService: AuthService, private router: Router) {}

// //   onSubmit(): void {
// //     if (!this.loginData.email || !this.loginData.password) {
// //       this.errorMessage = 'Please fill in all fields';
// //       return;
// //     }

// //     this.isLoading = true;
// //     this.errorMessage = '';

// //     this.authService.login(this.loginData).subscribe({
// //       next: (response) => {
// //         this.isLoading = false;
// //         this.router.navigate(['/dashboard']);
// //       },
// //       error: (error) => {
// //         this.isLoading = false;
// //         this.errorMessage = error.error?.detail || 'Login failed. Please try again.';
// //       }
// //     });
// //   }
// // }

// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Router, RouterModule } from '@angular/router';
// import { AuthService } from '../../services/auth.service';
// import { UserLogin } from '../../models/user.model';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule, FormsModule, RouterModule],
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css']
// })
// export class LoginComponent {
//   loginData: UserLogin = {
//     email: '',
//     password: ''
//   };

//   isLoading = false;
//   errorMessage = '';

//   constructor(private authService: AuthService, private router: Router) {}

//   onSubmit(): void {
//     if (!this.loginData.email || !this.loginData.password) {
//       this.errorMessage = 'Please fill in all fields';
//       return;
//     }

//     this.isLoading = true;
//     this.errorMessage = '';

//     this.authService.login(this.loginData).subscribe({
//       next: () => {
//         // ✅ Wait for currentUser$ to emit
//         this.authService.currentUser$.subscribe(user => {
//           this.isLoading = false;
//           if (!user) {
//             this.errorMessage = 'User info not available. Please try again.';
//             return;
//           }

//           console.log('Logged in user role:', user.role);

//           if (user.role === 'trainer') {
//             this.router.navigate(['/trainer-dashboard']);
//           } else if (user.role === 'Student') {
//             this.router.navigate(['/student-dashboard']);
//           }
//         });
//       },
//       error: (error) => {
//         this.isLoading = false;
//         this.errorMessage = error.error?.detail || 'Login failed. Please try again.';
//       }
//     });
//   }
// }

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserLogin } from '../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData: UserLogin = {
    email: '',
    password: ''
  };

  isLoading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (!this.loginData.email || !this.loginData.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginData).subscribe({
      next: () => {
        // Wait for currentUser$ to emit and get user info
        this.authService.currentUser$.subscribe(user => {
          this.isLoading = false;
          if (!user) {
            this.errorMessage = 'User info not available. Please try again.';
            return;
          }

          console.log('Logged in user role:', user.role);

          // Check role and navigate accordingly (case-insensitive comparison)
          const userRole = user.role.toLowerCase().trim();
          
          if (userRole === 'trainer') {
            this.router.navigate(['/trainer-dashboard']);
          } else if (userRole === 'student') {
            this.router.navigate(['/student-dashboard']);
          } else if (userRole === 'admin') {
            this.router.navigate(['/admin-dashboard']);
          } else {
            // Default fallback for any other role or unrecognized role
            console.warn('Unrecognized role:', user.role, 'Defaulting to student dashboard');
            this.router.navigate(['/student-dashboard']);
          }
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.detail || 'Login failed. Please try again.';
      }
    });
  }
}