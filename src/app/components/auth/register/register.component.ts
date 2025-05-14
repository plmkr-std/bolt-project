import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { ErrorMessageComponent } from '../../shared/error-message/error-message.component';
import { RegisterRequestDTO, UserRoleDTO } from '../../../models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ErrorMessageComponent, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div class="w-full max-w-md animate-fade-in">
        <div class="card">
          <div class="mb-8 text-center">
            <h1 class="form-title">Создание аккаунта</h1>
            <p class="form-subtitle">Введите данные для регистрации нового аккаунта</p>
          </div>

          @if (errorMessage) {
            <div class="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-md mb-6 animate-slide-up">
              {{ errorMessage }}
            </div>
          }

          @if (successMessage) {
            <div class="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-md mb-6 animate-slide-up">
              <p class="mb-2">{{ successMessage }}</p>
              <p class="text-sm">
                Пожалуйста, проверьте вашу электронную почту и следуйте инструкциям для подтверждения аккаунта.
                Письмо может прийти в течение нескольких минут.
              </p>
            </div>
          }

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <div class="mb-4">
              <label for="username" class="form-label">Логин</label>
              <input
                id="username"
                type="text"
                class="form-input"
                formControlName="username"
                placeholder="Придумайте логин"
                autocomplete="username"
              />
              <app-error-message [control]="registerForm.get('username')" />
            </div>

            <div class="mb-4">
              <label for="email" class="form-label">Email</label>
              <input
                id="email"
                type="email"
                class="form-input"
                formControlName="email"
                placeholder="Введите email адрес"
                autocomplete="email"
              />
              <app-error-message [control]="registerForm.get('email')" />
            </div>

            <div class="mb-4">
              <label for="password" class="form-label">Пароль</label>
              <input
                id="password"
                type="password"
                class="form-input"
                formControlName="password"
                placeholder="Придумайте пароль"
                autocomplete="new-password"
              />
              <app-error-message [control]="registerForm.get('password')" />
            </div>

            <div class="mb-6">
              <label for="confirmPassword" class="form-label">Подтверждение пароля</label>
              <input
                id="confirmPassword"
                type="password"
                class="form-input"
                formControlName="confirmPassword"
                placeholder="Повторите пароль"
                autocomplete="new-password"
              />
              <app-error-message [control]="registerForm.get('confirmPassword')" />
              @if (passwordMismatch) {
                <p class="form-error animate-slide-up">Пароли не совпадают</p>
              }
            </div>

            <button
              type="submit"
              [disabled]="isLoading || !registerForm.valid || passwordMismatch"
              class="btn btn-primary w-full mb-4"
              [ngClass]="{'opacity-70 cursor-not-allowed': isLoading || !registerForm.valid || passwordMismatch}"
            >
              <span>{{ isLoading ? 'Создание аккаунта...' : 'Создать аккаунт' }}</span>
            </button>
          </form>

          <div class="form-footer">
            <p>
              Уже есть аккаунт?
              <a routerLink="/auth/login" class="form-link">Войти</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  passwordMismatch = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.valid && !this.isLoading) {
      const formValue = this.registerForm.value;
      
      if (formValue.password !== formValue.confirmPassword) {
        this.passwordMismatch = true;
        return;
      }
      
      this.passwordMismatch = false;
      this.isLoading = true;
      this.errorMessage = null;
      this.successMessage = null;

      const registerData: RegisterRequestDTO = {
        username: formValue.username,
        email: formValue.email,
        password: formValue.password,
        roles: [{ id: 1, name: 'USER' } as UserRoleDTO]
      };

      this.authService.register(registerData)
        .pipe(
          catchError(error => {
            this.errorMessage = error.message || 'Ошибка регистрации. Пожалуйста, попробуйте снова.';
            return of(null);
          }),
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe(response => {
          if (response) {
            this.successMessage = 'Регистрация успешна!';
            this.registerForm.reset();
            
            setTimeout(() => {
              this.router.navigate(['/auth/login']);
            }, 5000);
          }
        });
    }
  }
}