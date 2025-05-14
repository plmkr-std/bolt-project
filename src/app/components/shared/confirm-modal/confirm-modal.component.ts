import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 class="text-xl font-semibold mb-4">{{ title }}</h2>
        <p class="text-gray-600 mb-6">{{ message }}</p>
        
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            class="btn btn-secondary"
            (click)="onCancel()"
          >
            {{ cancelText }}
          </button>
          <button
            type="button"
            class="btn btn-primary"
            (click)="onConfirm()"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class ConfirmModalComponent {
  @Input() title = 'Подтверждение';
  @Input() message = 'Вы уверены?';
  @Input() confirmText = 'Подтвердить';
  @Input() cancelText = 'Отмена';
  
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}