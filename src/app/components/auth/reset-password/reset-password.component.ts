import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { ErrorMessageComponent } from '../../shared/error-message/error-message.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ErrorMessageComponent, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div class="w-full max-w-md animate-fade-in">
        <div class="card">
          <div class="mb-8 text-center">
            <h1 class="form-title">Сброс пароля</h1>
            <p class="form-subtitle">Введите email для получения ссылки на сброс пароля</p>
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

          <form [formGroup]="resetForm" (ngSubmit)="onSubmit()">
            <div class="mb-6">
              <label for="email" class="form-label">Email адрес</label>
              <input
                id="email"
                type="email"
                class="form-input"
                formControlName="email"
                placeholder="Введите ваш email адрес"
                autocomplete="email"
              />
              <app-error-message [control]="resetForm.get('email')" />
            </div>

            <button
              type="submit"
              [disabled]="isLoading || !resetForm.valid"
              class="btn btn-primary w-full mb-4"
              [ngClass]="{'opacity-70 cursor-not-allowed': isLoading || !resetForm.valid}"
            >
              <span>{{ isLoading ? 'Отправка...' : 'Отправить ссылку' }}</span>
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
export class ResetPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.resetForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = null;
      this.successMessage = null;

      this.authService.resetPassword({ email: this.resetForm.value.email })
        .pipe(
          catchError(error => {
            this.errorMessage = error.message || 'Не удалось отправить запрос на сброс пароля. Пожалуйста, попробуйте снова.';
            return of(null);
          }),
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe(response => {
          if (response) {
            this.successMessage = 'Ссылка для сброса пароля отправлена на ваш email адрес.';
            this.resetForm.reset();
          }
        });
    }
  }
}