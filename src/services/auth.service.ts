import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, throwError, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User, NewUserCredentials, UserLogin } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://sakthibillionaire-gym.hf.space';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private loadingSubject = new BehaviorSubject<boolean>(true);

  public currentUser$ = this.currentUserSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = this.getStoredToken();
    const refreshToken = this.getStoredRefreshToken();
    const user = this.getStoredUser();

    if (token && user) {
      if (this.isTokenExpired(token)) {
        if (refreshToken && !this.isTokenExpired(refreshToken)) {
          this.refreshAccessToken().subscribe({
            next: () => {
              this.setAuthState(true, user, token);
              this.loadingSubject.next(false);
            },
            error: () => {
              this.clearAuthData();
              this.loadingSubject.next(false);
            }
          });
        } else {
          this.clearAuthData();
          this.loadingSubject.next(false);
        }
      } else {
        this.validateTokenWithServer(token).subscribe({
          next: (validatedUser) => {
            this.setAuthState(true, validatedUser || user, token);
            this.loadingSubject.next(false);
          },
          error: () => {
            if (refreshToken) {
              this.refreshAccessToken().subscribe({
                next: () => {
                  this.setAuthState(true, user, this.getStoredToken()!);
                  this.loadingSubject.next(false);
                },
                error: () => {
                  this.clearAuthData();
                  this.loadingSubject.next(false);
                }
              });
            } else {
              this.clearAuthData();
              this.loadingSubject.next(false);
            }
          }
        });
      }
    } else {
      this.clearAuthData();
      this.loadingSubject.next(false);
    }

    // ✅ Emit user and token again during init
    this.currentUserSubject.next(user);
    this.tokenSubject.next(token);
  }

  private validateTokenWithServer(token: string): Observable<User | null> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`${this.apiUrl}/me`, { headers }).pipe(
      tap(response => {
        console.log('Token validation response:', response);
      }),
      catchError(error => throwError(() => error))
    );
  }

  register(credentials: NewUserCredentials): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, credentials);
  }
  login(credentials: UserLogin): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        const token = response.token || response.access_token;
        const refreshToken = response.refresh_token;

        if (token) {
          this.storeTokens(token, refreshToken);

          const user: User = {
            name: response.username || response.name || 'User',
            email: credentials.email,
            role: response.role ? response.role.toLowerCase() : 'student'
          };

          this.storeUser(user);
          this.setAuthState(true, user, token);

          // ✅ Ensure subjects are updated immediately
          this.currentUserSubject.next(user);
          this.tokenSubject.next(token);
        }
      }),
      catchError(error => throwError(() => error))
    );
  }

  refreshAccessToken(): Observable<any> {
    if (this.isRefreshing) {
      return this.refreshTokenSubject.pipe(
        switchMap(token => {
          if (token) return of({ token });
          else return throwError(() => new Error('Token refresh failed'));
        })
      );
    }

    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    const refreshToken = this.getStoredRefreshToken();
    if (!refreshToken) {
      this.isRefreshing = false;
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<any>(`${this.apiUrl}/refresh`, {
      refresh_token: refreshToken
    }).pipe(
      tap(response => {
        const newToken = response.token || response.access_token;
        const newRefreshToken = response.refresh_token;

        if (newToken) {
          this.storeTokens(newToken, newRefreshToken);
          this.tokenSubject.next(newToken);
          this.refreshTokenSubject.next(newToken);
        }

        this.isRefreshing = false;
      }),
      catchError(error => {
        this.isRefreshing = false;
        this.refreshTokenSubject.next(null);
        this.clearAuthData();
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    const token = this.getStoredToken();
    if (token) {
      this.http.post(`${this.apiUrl}/logout`, {}, {
        headers: this.getAuthHeaders()
      }).subscribe({
        complete: () => {},
        error: (error) => {
          console.error('Logout error:', error);
        }
      });
    }

    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = this.getStoredToken();
    return !!token && !this.isTokenExpired(token);
  }

  getCurrentUser(): User | null {
    return this.getStoredUser();
  }

  getToken(): string | null {
    return this.getStoredToken();
  }

  authenticatedRequest<T>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', 
                         endpoint: string, 
                         data?: any): Observable<T> {
    return this.makeAuthenticatedRequest<T>(method, endpoint, data).pipe(
      catchError(error => {
        if (error.status === 401) {
          return this.refreshAccessToken().pipe(
            switchMap(() => {
              return this.makeAuthenticatedRequest<T>(method, endpoint, data);
            }),
            catchError(refreshError => {
              this.clearAuthData();
              this.router.navigate(['/login']);
              return throwError(() => refreshError);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }

  private makeAuthenticatedRequest<T>(method: string, endpoint: string, data?: any): Observable<T> {
    const headers = this.getAuthHeaders();
    const url = `${this.apiUrl}${endpoint}`;

    switch (method) {
      case 'GET': return this.http.get<T>(url, { headers });
      case 'POST': return this.http.post<T>(url, data, { headers });
      case 'PUT': return this.http.put<T>(url, data, { headers });
      case 'DELETE': return this.http.delete<T>(url, { headers });
      default: return throwError(() => new Error(`Unsupported method: ${method}`));
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getStoredToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getGymStatus(): Observable<any> {
    return this.authenticatedRequest('GET', '/gym-status');
  }

  updateGymStatus(status: string): Observable<any> {
    return this.authenticatedRequest('POST', '/gym-status', { status });
  }

  getUsers(): Observable<any> {
    return this.authenticatedRequest('GET', '/users');
  }

  getAllRegisteredUsers(): Observable<User[]> {
    return this.authenticatedRequest<User[]>('GET', '/users');
  }

  private storeTokens(accessToken: string, refreshToken?: string): void {
    localStorage.setItem('gym_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('gym_refresh_token', refreshToken);
    }
  }

  private storeUser(user: User): void {
    localStorage.setItem('gym_user', JSON.stringify(user));
  }

  private getStoredToken(): string | null {
    return localStorage.getItem('gym_token');
  }

  private getStoredRefreshToken(): string | null {
    return localStorage.getItem('gym_refresh_token');
  }

  private getStoredUser(): User | null {
    const user = localStorage.getItem('gym_user');
    return user ? JSON.parse(user) : null;
  }

  private setAuthState(isAuth: boolean, user: User | null, token: string | null): void {
    this.isAuthenticatedSubject.next(isAuth);
    this.currentUserSubject.next(user);
    this.tokenSubject.next(token);
  }

  private clearAuthData(): void {
    localStorage.removeItem('gym_token');
    localStorage.removeItem('gym_refresh_token');
    localStorage.removeItem('gym_user');
    this.setAuthState(false, null, null);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error parsing token:', error);
      return true;
    }
  }
}
