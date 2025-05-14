import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (shouldShowErrors()) {
      <div class="form-error animate-slide-up">
        @if (control?.hasError('required')) {
          <span>Это поле обязательно для заполнения</span>
        } @else if (control?.hasError('email')) {
          <span>Пожалуйста, введите корректный email адрес</span>
        } @else if (control?.hasError('minlength')) {
          <span>
            Минимальная длина {{ control?.errors?.['minlength']?.requiredLength ?? 0 }} символов
          </span>
        } @else if (control?.hasError('maxlength')) {
          <span>
            Максимальная длина {{ control?.errors?.['maxlength']?.requiredLength ?? 0 }} символов
          </span>
        } @else if (control?.hasError('pattern')) {
          <span>Неверный формат</span>
        } @else {
          <span>{{ getCustomErrorMessage() }}</span>
        }
      </div>
    }
  `
})
export class ErrorMessageComponent {
  @Input() control: AbstractControl | FormControl | null = null;
  @Input() customErrors: { [key: string]: string } = {};

  shouldShowErrors(): boolean {
    return !!(
      this.control &&
      this.control.errors &&
      (this.control.dirty || this.control.touched)
    );
  }

  getCustomErrorMessage(): string {
    if (!this.control?.errors) return '';
    
    const errorKey = Object.keys(this.control.errors)[0];
    
    return this.customErrors[errorKey] || `Ошибка валидации: ${errorKey}`;
  }
}