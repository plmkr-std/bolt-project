import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { ErrorMessageComponent } from '../../shared/error-message/error-message.component';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ErrorMessageComponent],
  template: `
    <div class="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div class="w-full max-w-md animate-fade-in">
        <div class="card">
          <div class="mb-8 text-center">
            <h1 class="form-title">Установка нового пароля</h1>
            <p class="form-subtitle">Создайте новый пароль для вашего аккаунта</p>
          </div>

          @if (errorMessage) {
            <div class="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-md mb-6 animate-slide-up">
              {{ errorMessage }}
            </div>
          }

          @if (successMessage) {
            <div class="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-md mb-6 animate-slide-up">
              {{ successMessage }}
            </div>
          }

          <form [formGroup]="newPasswordForm" (ngSubmit)="onSubmit()">
            <div class="mb-4">
              <label for="password" class="form-label">Новый пароль</label>
              <input
                id="password"
                type="password"
                class="form-input"
                formControlName="password"
                placeholder="Введите новый пароль"
                autocomplete="new-password"
              />
              <app-error-message [control]="newPasswordForm.get('password')" />
            </div>

            <div class="mb-6">
              <label for="confirmPassword" class="form-label">Подтверждение пароля</label>
              <input
                id="confirmPassword"
                type="password"
                class="form-input"
                formControlName="confirmPassword"
                placeholder="Повторите новый пароль"
                autocomplete="new-password"
              />
              <app-error-message [control]="newPasswordForm.get('confirmPassword')" />
              @if (passwordMismatch) {
                <p class="form-error animate-slide-up">Пароли не совпадают</p>
              }
            </div>

            <button
              type="submit"
              [disabled]="isLoading || !newPasswordForm.valid || passwordMismatch"
              class="btn btn-primary w-full mb-4"
              [ngClass]="{'opacity-70 cursor-not-allowed': isLoading || !newPasswordForm.valid || passwordMismatch}"
            >
              <span>{{ isLoading ? 'Установка пароля...' : 'Установить новый пароль' }}</span>
            </button>
          </form>

          <div class="form-footer">
            <p>
              Вспомнили пароль?
              <a routerLink="/auth/login" class="form-link">Вернуться к входу</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class NewPasswordComponent implements OnInit {
  newPasswordForm!: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  passwordMismatch = false;
  token: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    
    if (!this.token) {
      this.errorMessage = 'Неверный или отсутствующий токен для сброса пароля.';
      setTimeout(() => {
        this.router.navigate(['/auth/reset-password']);
      }, 3000);
    }

    this.newPasswordForm = this.fb.group({
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
    if (this.newPasswordForm.valid && !this.isLoading && this.token) {
      const formValue = this.newPasswordForm.value;
      
      if (formValue.password !== formValue.confirmPassword) {
        this.passwordMismatch = true;
        return;
      }
      
      this.passwordMismatch = false;
      this.isLoading = true;
      this.errorMessage = null;
      this.successMessage = null;

      this.authService.setNewPassword({
        token: this.token,
        password: formValue.password
      })
        .pipe(
          catchError(error => {
            this.errorMessage = error.message || 'Не удалось установить новый пароль. Пожалуйста, попробуйте снова.';
            return of(null);
          }),
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe(response => {
          if (response) {
            this.successMessage = 'Ваш пароль успешно обновлен.';
            this.newPasswordForm.reset();
            
            setTimeout(() => {
              this.router.navigate(['/auth/login']);
            }, 2000);
          }
        });
    }
  }
}