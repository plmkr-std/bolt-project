import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { ErrorMessageComponent } from '../../shared/error-message/error-message.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ErrorMessageComponent, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div class="w-full max-w-md animate-fade-in">
        <div class="card">
          <div class="mb-8 text-center">
            <h1 class="form-title">Вход в систему</h1>
            <p class="form-subtitle">Введите свои учетные данные для входа в аккаунт</p>
          </div>

          @if (errorMessage) {
            <div class="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-md mb-6 animate-slide-up">
              {{ errorMessage }}
            </div>
          }

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="mb-4">
              <label for="login" class="form-label">Логин или Email</label>
              <input
                id="login"
                type="text"
                class="form-input"
                formControlName="login"
                placeholder="Введите логин или email"
                autocomplete="username"
              />
              <app-error-message [control]="loginForm.get('login')" />
            </div>

            <div class="mb-6">
              <div class="flex justify-between items-center">
                <label for="password" class="form-label">Пароль</label>
                <a routerLink="/auth/reset-password" class="text-xs form-link">Забыли пароль?</a>
              </div>
              <input
                id="password"
                type="password"
                class="form-input"
                formControlName="password"
                placeholder="Введите пароль"
                autocomplete="current-password"
              />
              <app-error-message [control]="loginForm.get('password')" />
            </div>

            <button
              type="submit"
              [disabled]="isLoading || !loginForm.valid"
              class="btn btn-primary w-full mb-4"
              [ngClass]="{'opacity-70 cursor-not-allowed': isLoading || !loginForm.valid}"
            >
              <span>{{ isLoading ? 'Выполняется вход...' : 'Войти' }}</span>
            </button>

            <div class="relative my-6">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">Или войти через</span>
              </div>
            </div>

            <button 
              type="button" 
              class="btn btn-google w-full flex items-center justify-center space-x-2"
              (click)="loginWithGoogle()"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" class="w-5 h-5">
                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
              </svg>
              <span>Войти через Google</span>
            </button>
          </form>

          <div class="form-footer">
            <p>
              Нет аккаунта?
              <a routerLink="/auth/register" class="form-link">Зарегистрироваться</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = null;

      this.authService.login(this.loginForm.value)
        .pipe(
          catchError(error => {
            this.errorMessage = error.message || 'Ошибка входа. Пожалуйста, попробуйте снова.';
            return of(null);
          }),
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe(response => {
          if (response) {
            this.router.navigate(['/dashboard']);
          }
        });
    }
  }

  loginWithGoogle(): void {
    alert('Функция входа через Google будет добавлена позже.');
  }
}