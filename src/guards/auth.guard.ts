// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable, BehaviorSubject, tap, throwError, of } from 'rxjs';
// import { catchError, switchMap } from 'rxjs/operators';
// import { Router } from '@angular/router';
// import { User, NewUserCredentials, UserLogin, LoginResponse } from '../models/user.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private apiUrl = 'https://t0806zkn-8000.inc1.devtunnels.ms';
//   private currentUserSubject = new BehaviorSubject<User | null>(null);
//   private tokenSubject = new BehaviorSubject<string | null>(null);
//   private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
//   private loadingSubject = new BehaviorSubject<boolean>(true);

//   public currentUser$ = this.currentUserSubject.asObservable();
//   public token$ = this.tokenSubject.asObservable();
//   public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
//   public loading$ = this.loadingSubject.asObservable();

//   // Token refresh variables
//   private isRefreshing = false;
//   private refreshTokenSubject = new BehaviorSubject<string | null>(null);

//   constructor(private http: HttpClient, private router: Router) {
//     this.initializeAuth();
//   }

//   /**
//    * Initialize authentication on service startup
//    * Check for existing tokens and validate them
//    */
//   private initializeAuth(): void {
//     console.log('Initializing authentication...');
    
//     const token = this.getStoredToken();
//     const refreshToken = this.getStoredRefreshToken();
//     const user = this.getStoredUser();

//     if (token && user) {
//       console.log('Found stored token and user, validating...');
      
//       if (this.isTokenExpired(token)) {
//         console.log('Access token expired, attempting refresh...');
        
//         if (refreshToken && !this.isTokenExpired(refreshToken)) {
//           // Try to refresh the token
//           this.refreshAccessToken().subscribe({
//             next: () => {
//               console.log('Token refreshed successfully');
//               this.setAuthState(true, user, token);
//               this.loadingSubject.next(false);
//             },
//             error: (error) => {
//               console.error('Token refresh failed:', error);
//               this.clearAuthData();
//               this.loadingSubject.next(false);
//             }
//           });
//         } else {
//           console.log('Refresh token expired or missing');
//           this.clearAuthData();
//           this.loadingSubject.next(false);
//         }
//       } else {
//         // Token is valid, validate with server
//         console.log('Token appears valid, validating with server...');
//         this.validateTokenWithServer(token).subscribe({
//           next: (validatedUser) => {
//             console.log('Server validation successful');
//             this.setAuthState(true, validatedUser || user, token);
//             this.loadingSubject.next(false);
//           },
//           error: (error) => {
//             console.error('Server validation failed:', error);
//             // Try refresh if validation fails
//             if (refreshToken) {
//               this.refreshAccessToken().subscribe({
//                 next: () => {
//                   this.setAuthState(true, user, this.getStoredToken()!);
//                   this.loadingSubject.next(false);
//                 },
//                 error: () => {
//                   this.clearAuthData();
//                   this.loadingSubject.next(false);
//                 }
//               });
//             } else {
//               this.clearAuthData();
//               this.loadingSubject.next(false);
//             }
//           }
//         });
//       }
//     } else {
//       console.log('No stored authentication data found');
//       this.clearAuthData();
//       this.loadingSubject.next(false);
//     }
//   }

//   /**
//    * Validate token with server
//    */
//   private validateTokenWithServer(token: string): Observable<User | null> {
//     const headers = new HttpHeaders({
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     });

//     // Try to get current user info to validate token
//     return this.http.get<any>(`${this.apiUrl}/auth/me`, { headers }).pipe(
//       tap(response => {
//         console.log('Token validation response:', response);
//       }),
//       catchError(error => {
//         console.error('Token validation error:', error);
//         return throwError(() => error);
//       })
//     );
//   }

//   register(credentials: NewUserCredentials): Observable<any> {
//     return this.http.post(`${this.apiUrl}/auth/new_user`, credentials);
//   }

//   login(credentials: UserLogin): Observable<any> {
//     return this.http.post(`${this.apiUrl}/auth/login`, credentials).pipe(
//       tap((response: any) => {
//         console.log('Login response:', response);
        
//         const token = response.token || response.access_token;
//         const refreshToken = response.refresh_token;
        
//         if (token) {
//           // Store tokens
//           this.storeTokens(token, refreshToken);
          
//           // Create user object
//           const user: User = {
//             name: response.username || response.name || 'User',
//             email: credentials.email,
//             role: response.role ? response.role.toLowerCase() : 'student'
//           };
          
//           console.log('Storing user after login:', user);
//           this.storeUser(user);
//           this.setAuthState(true, user, token);
//         }
//       }),
//       catchError(error => {
//         console.error('Login error:', error);
//         return throwError(() => error);
//       })
//     );
//   }

//   /**
//    * Refresh access token using refresh token
//    */
//   refreshAccessToken(): Observable<any> {
//     if (this.isRefreshing) {
//       // If already refreshing, wait for the result
//       return this.refreshTokenSubject.pipe(
//         switchMap(token => {
//           if (token) {
//             return of({ token });
//           } else {
//             return throwError(() => new Error('Token refresh failed'));
//           }
//         })
//       );
//     }

//     this.isRefreshing = true;
//     this.refreshTokenSubject.next(null);

//     const refreshToken = this.getStoredRefreshToken();
    
//     if (!refreshToken) {
//       this.isRefreshing = false;
//       return throwError(() => new Error('No refresh token available'));
//     }

//     return this.http.post<any>(`${this.apiUrl}/auth/refresh`, {
//       refresh_token: refreshToken
//     }).pipe(
//       tap(response => {
//         console.log('Token refresh response:', response);
        
//         const newToken = response.token || response.access_token;
//         const newRefreshToken = response.refresh_token;
        
//         if (newToken) {
//           this.storeTokens(newToken, newRefreshToken);
//           this.tokenSubject.next(newToken);
//           this.refreshTokenSubject.next(newToken);
//         }
        
//         this.isRefreshing = false;
//       }),
//       catchError(error => {
//         console.error('Token refresh error:', error);
//         this.isRefreshing = false;
//         this.refreshTokenSubject.next(null);
//         this.clearAuthData();
//         return throwError(() => error);
//       })
//     );
//   }

//   logout(): void {
//     console.log('Logging out user...');
    
//     // Optionally call logout endpoint
//     const token = this.getStoredToken();
//     if (token) {
//       this.http.post(`${this.apiUrl}/auth/logout`, {}, {
//         headers: this.getAuthHeaders()
//       }).subscribe({
//         complete: () => {
//           console.log('Server logout completed');
//         },
//         error: (error) => {
//           console.error('Server logout error:', error);
//         }
//       });
//     }
    
//     this.clearAuthData();
//     this.router.navigate(['/login']);
//   }

//   isAuthenticated(): boolean {
//     const token = this.getStoredToken();
//     const isAuth = !!token && !this.isTokenExpired(token);
//     console.log('isAuthenticated check:', isAuth, 'token exists:', !!token);
//     return isAuth;
//   }

//   getCurrentUser(): User | null {
//     const user = this.getStoredUser();
//     console.log('Getting current user:', user);
//     return user;
//   }

//   getToken(): string | null {
//     return this.getStoredToken();
//   }

//   /**
//    * Make authenticated HTTP requests with automatic token refresh
//    */
//   authenticatedRequest<T>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', 
//                          endpoint: string, 
//                          data?: any): Observable<T> {
//     return this.makeAuthenticatedRequest<T>(method, endpoint, data).pipe(
//       catchError(error => {
//         if (error.status === 401) {
//           // Token might be expired, try to refresh
//           return this.refreshAccessToken().pipe(
//             switchMap(() => {
//               // Retry the original request with new token
//               return this.makeAuthenticatedRequest<T>(method, endpoint, data);
//             }),
//             catchError(refreshError => {
//               console.error('Request failed after token refresh:', refreshError);
//               this.clearAuthData();
//               this.router.navigate(['/login']);
//               return throwError(() => refreshError);
//             })
//           );
//         }
//         return throwError(() => error);
//       })
//     );
//   }

//   private makeAuthenticatedRequest<T>(method: string, endpoint: string, data?: any): Observable<T> {
//     const headers = this.getAuthHeaders();
//     const url = `${this.apiUrl}${endpoint}`;

//     switch (method) {
//       case 'GET':
//         return this.http.get<T>(url, { headers });
//       case 'POST':
//         return this.http.post<T>(url, data, { headers });
//       case 'PUT':
//         return this.http.put<T>(url, data, { headers });
//       case 'DELETE':
//         return this.http.delete<T>(url, { headers });
//       default:
//         return throwError(() => new Error(`Unsupported method: ${method}`));
//     }
//   }

//   private getAuthHeaders(): HttpHeaders {
//     const token = this.getStoredToken();
//     return new HttpHeaders({
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     });
//   }

//   // Updated gym methods to use authenticated requests
//   getGymStatus(): Observable<any> {
//     return this.authenticatedRequest('GET', '/gym/status');
//   }

//   updateGymStatus(status: string): Observable<any> {
//     return this.authenticatedRequest('POST', '/gym/updates', { status });
//   }

//   getUsers(): Observable<any> {
//     return this.authenticatedRequest('GET', '/users');
//   }

//   /**
//    * Token management methods
//    */
//   private storeTokens(accessToken: string, refreshToken?: string): void {
//     localStorage.setItem('gym_token', accessToken);
//     if (refreshToken) {
//       localStorage.setItem('gym_refresh_token', refreshToken);
//     }
//   }

//   private storeUser(user: User): void {
//     localStorage.setItem('gym_user', JSON.stringify(user));
//   }

//   private getStoredToken(): string | null {
//     return localStorage.getItem('gym_token');
//   }

//   private getStoredRefreshToken(): string | null {
//     return localStorage.getItem('gym_refresh_token');
//   }

//   private getStoredUser(): User | null {
//     const user = localStorage.getItem('gym_user');
//     return user ? JSON.parse(user) : null;
//   }

//   private setAuthState(isAuth: boolean, user: User | null, token: string | null): void {
//     this.isAuthenticatedSubject.next(isAuth);
//     this.currentUserSubject.next(user);
//     this.tokenSubject.next(token);
//   }

//   private clearAuthData(): void {
//     console.log('Clearing authentication data...');
//     localStorage.removeItem('gym_token');
//     localStorage.removeItem('gym_refresh_token');
//     localStorage.removeItem('gym_user');
    
//     this.setAuthState(false, null, null);
//   }

//   /**
//    * Check if JWT token is expired
//    */
//   private isTokenExpired(token: string): boolean {
//     try {
//       const payload = JSON.parse(atob(token.split('.')[1]));
//       const currentTime = Math.floor(Date.now() / 1000);
//       const isExpired = payload.exp < currentTime;
      
//       console.log('Token expiry check:', {
//         exp: payload.exp,
//         current: currentTime,
//         expired: isExpired
//       });
      
//       return isExpired;
//     } catch (error) {
//       console.error('Error parsing token:', error);
//       return true;
//     }
//   }
// }
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      // Redirect to login if not authenticated
      return this.router.parseUrl('/login');
    }
  }
}
