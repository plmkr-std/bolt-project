import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { ErrorMessageComponent } from '../../shared/error-message/error-message.component';

@Component({
  selector: 'app-change-password-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ErrorMessageComponent],
  template: `
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Изменить пароль</h2>
          <button 
            (click)="onClose()"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        @if (errorMessage) {
          <div class="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-md mb-4">
            {{ errorMessage }}
          </div>
        }

        <form [formGroup]="passwordForm" (ngSubmit)="onSubmit()">
          <div class="mb-4">
            <label for="currentPassword" class="form-label">Текущий пароль</label>
            <input
              id="currentPassword"
              type="password"
              class="form-input"
              formControlName="currentPassword"
              placeholder="Введите текущий пароль"
            />
            <app-error-message [control]="passwordForm.get('currentPassword')" />
          </div>

          <div class="mb-4">
            <label for="newPassword" class="form-label">Новый пароль</label>
            <input
              id="newPassword"
              type="password"
              class="form-input"
              formControlName="newPassword"
              placeholder="Введите новый пароль"
            />
            <app-error-message [control]="passwordForm.get('newPassword')" />
          </div>

          <div class="mb-6">
            <label for="confirmPassword" class="form-label">Подтверждение пароля</label>
            <input
              id="confirmPassword"
              type="password"
              class="form-input"
              formControlName="confirmPassword"
              placeholder="Повторите новый пароль"
            />
            <app-error-message [control]="passwordForm.get('confirmPassword')" />
            @if (passwordMismatch) {
              <p class="form-error">Пароли не совпадают</p>
            }
          </div>

          <div class="flex justify-end space-x-3">
            <button
              type="button"
              class="btn btn-secondary"
              (click)="onClose()"
            >
              Отмена
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="isLoading || !passwordForm.valid || passwordMismatch"
            >
              {{ isLoading ? 'Сохранение...' : 'Сохранить' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ChangePasswordModalComponent {
  @Output() close = new EventEmitter<void>();
  
  passwordForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  passwordMismatch = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.passwordForm.valid && !this.isLoading) {
      const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value;
      
      if (newPassword !== confirmPassword) {
        this.passwordMismatch = true;
        return;
      }

      this.isLoading = true;
      this.errorMessage = null;
      this.passwordMismatch = false;

      this.userService.changePassword(currentPassword, newPassword)
        .subscribe({
          next: () => {
            this.onClose();
          },
          error: (error) => {
            this.errorMessage = error.message || 'Ошибка при смене пароля';
            this.isLoading = false;
          }
        });
    }
  }

  onClose(): void {
    this.close.emit();
  }
}