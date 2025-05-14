import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { 
  LoginRequestDTO, 
  RegisterRequestDTO, 
  ResetPasswordRequestDTO, 
  SetNewPasswordRequestDTO, 
  ApiSuccessResponseDTO,
  AuthState
} from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api/entry';
  private readonly TOKEN_KEY = 'auth_token';
  
  private authState = new BehaviorSubject<AuthState>({
    isAuthenticated: this.hasToken(),
    token: this.getToken(),
    userData: null,
    loading: false,
    error: null
  });

  public authState$ = this.authState.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserData();
  }

  login(loginData: LoginRequestDTO): Observable<ApiSuccessResponseDTO> {
    this.setLoading(true);
    return this.http.post<ApiSuccessResponseDTO>(`${this.API_URL}/login`, loginData)
      .pipe(
        tap(response => {
          if (response.data?.token) {
            this.setToken(response.data.token);
            this.updateAuthState({
              isAuthenticated: true,
              token: response.data.token,
              userData: response.data.userData || null,
              loading: false,
              error: null
            });
          }
        }),
        catchError(this.handleError.bind(this)),
        map(response => response)
      );
  }

  register(registerData: RegisterRequestDTO): Observable<ApiSuccessResponseDTO> {
    this.setLoading(true);
    return this.http.post<ApiSuccessResponseDTO>(`${this.API_URL}/register`, registerData)
      .pipe(
        catchError(this.handleError.bind(this)),
        tap(() => this.setLoading(false)),
        map(response => response)
      );
  }

  resetPassword(resetData: ResetPasswordRequestDTO): Observable<ApiSuccessResponseDTO> {
    this.setLoading(true);
    return this.http.post<ApiSuccessResponseDTO>(`${this.API_URL}/reset-password`, resetData)
      .pipe(
        catchError(this.handleError.bind(this)),
        tap(() => this.setLoading(false)),
        map(response => response)
      );
  }

  setNewPassword(newPasswordData: SetNewPasswordRequestDTO): Observable<ApiSuccessResponseDTO> {
    this.setLoading(true);
    return this.http.patch<ApiSuccessResponseDTO>(`${this.API_URL}/new-password`, newPasswordData)
      .pipe(
        catchError(this.handleError.bind(this)),
        tap(() => this.setLoading(false)),
        map(response => response)
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.updateAuthState({
      isAuthenticated: false,
      token: null,
      userData: null,
      loading: false,
      error: null
    });
  }

  private loadUserData(): void {
    // In a real application, you would likely make an API call to get user data
    // using the stored token. For now, we'll just set isAuthenticated based on token.
    if (this.hasToken()) {
      this.updateAuthState({
        ...this.authState.value,
        isAuthenticated: true,
        token: this.getToken()
      });
    }
  }

  private setLoading(loading: boolean): void {
    this.updateAuthState({
      ...this.authState.value,
      loading,
      error: loading ? null : this.authState.value.error
    });
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  private updateAuthState(state: Partial<AuthState>): void {
    this.authState.next({
      ...this.authState.value,
      ...state
    });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.status === 0) {
        errorMessage = 'Could not connect to the server. Please check your internet connection.';
      } else {
        errorMessage = `Error Code: ${error.status}, Message: ${error.message}`;
      }
    }
    
    this.updateAuthState({
      ...this.authState.value,
      loading: false,
      error: errorMessage
    });
    
    return throwError(() => new Error(errorMessage));
  }
}