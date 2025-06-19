// import { Component, OnInit } from '@angular/core';
// import { bootstrapApplication } from '@angular/platform-browser';
// import { provideRouter, Routes } from '@angular/router';
// import { provideHttpClient } from '@angular/common/http';
// import { CommonModule } from '@angular/common';
// import { RouterOutlet } from '@angular/router';
// import { AuthService } from './services/auth.service';
// import { AuthGuard } from './guards/auth.guard';
// import { LoginComponent } from './components/login/login.component';
// import { RegisterComponent } from './components/register/register.component';
// import { StudentDashboardComponent } from './components/student-dashboard/student-dashboard.component';
// import { TrainerDashboardComponent } from './components/trainer-dashboard/trainer-dashboard.component';

// // Dashboard routing component
// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [CommonModule, StudentDashboardComponent, TrainerDashboardComponent],
//   template: `
//     <div *ngIf="!isLoading">
//       <app-student-dashboard *ngIf="user && user.role === 'student'"></app-student-dashboard>
//       <app-trainer-dashboard *ngIf="user && (user.role === 'trainer' || user.role === 'master')"></app-trainer-dashboard>
      
//       <div *ngIf="!user" style="padding: 20px; text-align: center; color: red;">
//         <p>No user data found. Please login again.</p>
//         <button (click)="goToLogin()" style="padding: 10px 20px; background: #dc2626; color: white; border: none; border-radius: 5px; cursor: pointer;">
//           Go to Login
//         </button>
//       </div>
//     </div>
    
//     <div *ngIf="isLoading" style="display: flex; justify-content: center; align-items: center; height: 100vh;">
//       <div style="text-align: center;">
//         <div style="width: 40px; height: 40px; border: 4px solid #f3f4f6; border-top: 4px solid #2563eb; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px;"></div>
//         <p>Loading dashboard...</p>
//       </div>
//     </div>
//   `,
//   styles: [`
//     @keyframes spin {
//       0% { transform: rotate(0deg); }
//       100% { transform: rotate(360deg); }
//     }
//   `]
// })
// export class DashboardComponent implements OnInit {
//   user: any = null;
//   isLoading = true;
  
//   constructor(private authService: AuthService) {}
  
//   ngOnInit() {
//     this.user = this.authService.getCurrentUser();
//     console.log('Dashboard - Current user:', this.user);
    
//     if (!this.user) {
//       this.authService.currentUser$.subscribe(user => {
//         this.user = user;
//         console.log('Dashboard - User from observable:', this.user);
//         this.isLoading = false;
//       });
//     } else {
//       this.isLoading = false;
//     }
//   }
  
//   goToLogin() {
//     this.authService.logout();
//     window.location.href = '/login';
//   }
// }

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [CommonModule, RouterOutlet],
//   template: `<router-outlet></router-outlet>`
// })
// export class App {}

// const routes: Routes = [
//   { path: '', redirectTo: '/login', pathMatch: 'full' },
//   { path: 'login', component: LoginComponent },
//   { path: 'register', component: RegisterComponent },
//   { 
//     path: 'dashboard', 
//     component: DashboardComponent, 
//     canActivate: [AuthGuard] 
//   },
//   { path: '**', redirectTo: '/login' }
// ];

// bootstrapApplication(App, {
//   providers: [
//     provideRouter(routes),
//     provideHttpClient(),
//     AuthService,
//     AuthGuard
//   ]
// });



// import { Component } from '@angular/core';
// import { bootstrapApplication } from '@angular/platform-browser';
// import { provideRouter, Routes } from '@angular/router';
// import { provideHttpClient } from '@angular/common/http';
// import { CommonModule } from '@angular/common';
// import { RouterOutlet } from '@angular/router';

// import { AuthService } from './services/auth.service';
// import { AuthGuard } from './guards/auth.guard';

// import { LoginComponent } from './components/login/login.component';
// import { RegisterComponent } from './components/register/register.component';
// import { StudentDashboardComponent } from './components/student-dashboard/student-dashboard.component';
// import { TrainerDashboardComponent } from './components/trainer-dashboard/trainer-dashboard.component';

// // Optional fallback dashboard for shared UI
// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [CommonModule, StudentDashboardComponent, TrainerDashboardComponent],
//   template: `
//     <div *ngIf="!isLoading">
//       <app-student-dashboard *ngIf="user && user.role === 'student'"></app-student-dashboard>
//       <app-trainer-dashboard *ngIf="user && (user.role === 'trainer' || user.role === 'master')"></app-trainer-dashboard>
      
//       <div *ngIf="!user" style="padding: 20px; text-align: center; color: red;">
//         <p>No user data found. Please login again.</p>
//         <button (click)="goToLogin()" style="padding: 10px 20px; background: #dc2626; color: white; border: none; border-radius: 5px; cursor: pointer;">
//           Go to Login
//         </button>
//       </div>
//     </div>
    
//     <div *ngIf="isLoading" style="display: flex; justify-content: center; align-items: center; height: 100vh;">
//       <div style="text-align: center;">
//         <div style="width: 40px; height: 40px; border: 4px solid #f3f4f6; border-top: 4px solid #2563eb; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px;"></div>
//         <p>Loading dashboard...</p>
//       </div>
//     </div>
//   `,
//   styles: [`
//     @keyframes spin {
//       0% { transform: rotate(0deg); }
//       100% { transform: rotate(360deg); }
//     }
//   `]
// })
// export class DashboardComponent {
//   user: any = null;
//   isLoading = true;

//   constructor(private authService: AuthService) {}

//   ngOnInit() {
//     this.user = this.authService.getCurrentUser();
//     console.log('Dashboard - Current user:', this.user);

//     if (!this.user) {
//       this.authService.currentUser$.subscribe(user => {
//         this.user = user;
//         this.isLoading = false;
//       });
//     } else {
//       this.isLoading = false;
//     }
//   }

//   goToLogin() {
//     this.authService.logout();
//     window.location.href = '/login';
//   }
// }

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [CommonModule, RouterOutlet],
//   template: `<router-outlet></router-outlet>`
// })
// export class App {}

// const routes: Routes = [
//   { path: '', redirectTo: '/login', pathMatch: 'full' },
//   { path: 'login', component: LoginComponent },
//   { path: 'register', component: RegisterComponent },

//   // Role-based dashboards
//   { path: 'student-dashboard', component: StudentDashboardComponent, canActivate: [AuthGuard] },
//   { path: 'trainer-dashboard', component: TrainerDashboardComponent, canActivate: [AuthGuard] },

//   // Optional fallback
//   { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },

//   { path: '**', redirectTo: '/login' }
// ];

// bootstrapApplication(App, {
//   providers: [
//     provideRouter(routes),
//     provideHttpClient(),
//     AuthService,
//     AuthGuard
//   ]
// });


// import { Component, OnInit } from '@angular/core';
// import { bootstrapApplication } from '@angular/platform-browser';
// import { provideRouter, Routes, Router } from '@angular/router';
// import { provideHttpClient } from '@angular/common/http';
// import { CommonModule } from '@angular/common';
// import { RouterOutlet } from '@angular/router';

// import { AuthService } from './services/auth.service';
// import { AuthGuard } from './guards/auth.guard';

// import { LoginComponent } from './components/login/login.component';
// import { RegisterComponent } from './components/register/register.component';
// import { StudentDashboardComponent } from './components/student-dashboard/student-dashboard.component';
// import { TrainerDashboardComponent } from './components/trainer-dashboard/trainer-dashboard.component';

// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [CommonModule],
//   template: `
//     <div *ngIf="isLoading" style="display: flex; justify-content: center; align-items: center; height: 100vh;">
//       <div style="text-align: center;">
//         <div style="width: 40px; height: 40px; border: 4px solid #f3f4f6; border-top: 4px solid #2563eb; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px;"></div>
//         <p>Loading dashboard...</p>
//       </div>
//     </div>
//   `,
//   styles: [`
//     @keyframes spin {
//       0% { transform: rotate(0deg); }
//       100% { transform: rotate(360deg); }
//     }
//   `]
// })
// export class DashboardComponent implements OnInit {
//   isLoading = true;

//   constructor(private authService: AuthService, private router: Router) {}

//   ngOnInit() {
//     const user = this.authService.getCurrentUser();

//     if (user) {
//       this.redirectBasedOnRole(user.role);
//     } else {
//       this.authService.currentUser$.subscribe(currentUser => {
//         if (currentUser) {
//           this.redirectBasedOnRole(currentUser.role);
//         } else {
//           this.authService.logout();
//           this.router.navigate(['/login']);
//         }
//       });
//     }
//   }

//   private redirectBasedOnRole(role: string): void {
//     const lowerRole = role.toLowerCase();
//     this.isLoading = false;

//     if (lowerRole === 'student') {
//       this.router.navigate(['/student-dashboard']);
//     } else if (lowerRole === 'trainer' || lowerRole === 'master') {
//       this.router.navigate(['/trainer-dashboard']);
//     } else {
//       this.router.navigate(['/login']);
//     }
//   }
// }

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [CommonModule, RouterOutlet],
//   template: `<router-outlet></router-outlet>`
// })
// export class App {}

// const routes: Routes = [
//   { path: '', redirectTo: '/login', pathMatch: 'full' },
//   { path: 'login', component: LoginComponent },
//   { path: 'register', component: RegisterComponent },

//   // Protected dashboards
//   { path: 'student-dashboard', component: StudentDashboardComponent, canActivate: [AuthGuard] },
//   { path: 'trainer-dashboard', component: TrainerDashboardComponent, canActivate: [AuthGuard] },

//   // Smart redirection component
//   { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },

//   { path: '**', redirectTo: '/login' }
// ];

// bootstrapApplication(App, {
//   providers: [
//     provideRouter(routes),
//     provideHttpClient(),
//     AuthService,
//     AuthGuard
//   ]
// });

import { Component, OnInit } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { StudentDashboardComponent } from './components/student-dashboard/student-dashboard.component';
import { TrainerDashboardComponent } from './components/trainer-dashboard/trainer-dashboard.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isLoading" style="display: flex; justify-content: center; align-items: center; height: 100vh;">
      <div style="text-align: center;">
        <div style="width: 40px; height: 40px; border: 4px solid #f3f4f6; border-top: 4px solid #2563eb; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px;"></div>
        <p>Loading dashboard...</p>
      </div>
    </div>
  `,
  styles: [`
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class DashboardComponent implements OnInit {
  isLoading = true;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();

    if (user) {
      this.redirectBasedOnRole(user.role);
    } else {
      this.authService.currentUser$.subscribe(currentUser => {
        if (currentUser) {
          this.redirectBasedOnRole(currentUser.role);
        } else {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      });
    }
  }

  private redirectBasedOnRole(role: string): void {
    const lowerRole = role.toLowerCase();
    this.isLoading = false;

    if (lowerRole === 'Student') {
      this.router.navigate(['/student-dashboard']);
    } else if (lowerRole === 'trainer' || lowerRole === 'master') {
      this.router.navigate(['/trainer-dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `<router-outlet></router-outlet>`
})
export class App {}

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Protected dashboards
  { path: 'student-dashboard', component: StudentDashboardComponent, canActivate: [AuthGuard] },
  { path: 'trainer-dashboard', component: TrainerDashboardComponent, canActivate: [AuthGuard] },

  // Smart redirection component
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },

  { path: '**', redirectTo: '/login' }
];

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    AuthService,
    AuthGuard
  ]
});
