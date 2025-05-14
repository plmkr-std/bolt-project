import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ValidationSettingsDTO } from '../../../models/validation.model';

@Component({
  selector: 'app-validation-settings-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col">
        <!-- Фиксированный заголовок -->
        <div class="p-6 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold text-gray-900">Настройки проверки</h2>
            <button 
              (click)="onCancel()"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Прокручиваемый контент -->
        <div class="flex-1 overflow-y-auto p-6">
          <div class="space-y-6">
            <!-- Настройки раздела -->
            <div class="space-y-4">
              <h3 class="text-sm font-medium text-gray-700">Настройки раздела</h3>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    Формат страницы
                  </label>
                  <select
                    [(ngModel)]="settings.sectionSettings.pageFormat"
                    class="form-input"
                  >
                    <option value="A4">A4</option>
                    <option value="A3">A3</option>
                    <option value="Letter">Letter</option>
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    Шаблон полей
                  </label>
                  <select
                    [(ngModel)]="settings.sectionSettings.fieldTemplate"
                    class="form-input"
                  >
                    <option value="standard">Стандартный</option>
                    <option value="wide">Широкий</option>
                    <option value="narrow">Узкий</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Настройки параграфа -->
            <div class="space-y-4">
              <h3 class="text-sm font-medium text-gray-700">Настройки параграфа</h3>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    Абзацный отступ (см)
                  </label>
                  <input
                    type="number"
                    [(ngModel)]="settings.paragraphSettings.firstLine"
                    class="form-input"
                    step="0.1"
                    min="0"
                  >
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    Межстрочный интервал
                  </label>
                  <input
                    type="number"
                    [(ngModel)]="settings.paragraphSettings.lineSpacing"
                    class="form-input"
                    step="0.1"
                    min="1"
                  >
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    Интервал перед (пт)
                  </label>
                  <input
                    type="number"
                    [(ngModel)]="settings.paragraphSettings.intervalBeforeSpacing"
                    class="form-input"
                    min="0"
                  >
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    Интервал после (пт)
                  </label>
                  <input
                    type="number"
                    [(ngModel)]="settings.paragraphSettings.intervalAfterSpacing"
                    class="form-input"
                    min="0"
                  >
                </div>
              </div>
            </div>

            <!-- Настройки текста -->
            <div class="space-y-4">
              <h3 class="text-sm font-medium text-gray-700">Настройки текста</h3>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    Стиль шрифта
                  </label>
                  <select
                    [(ngModel)]="settings.textSettings.fontStyle"
                    class="form-input"
                  >
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Arial">Arial</option>
                    <option value="Calibri">Calibri</option>
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    Мин. размер шрифта
                  </label>
                  <input
                    type="number"
                    [(ngModel)]="settings.textSettings.leftBorderFontSize"
                    class="form-input"
                    min="8"
                  >
                </div>

                <div class="space-y-2 col-span-2">
                  <label class="block text-sm font-medium text-gray-700">
                    Макс. размер шрифта
                  </label>
                  <input
                    type="number"
                    [(ngModel)]="settings.textSettings.rightBorderFontSize"
                    class="form-input"
                    min="8"
                  >
                </div>
              </div>
            </div>

            <!-- Дополнительные настройки -->
            <div class="space-y-4">
              <div class="flex items-center space-x-2">
                <input
                  type="checkbox"
                  [(ngModel)]="settings.toFix"
                  class="form-checkbox"
                >
                <span class="text-sm text-gray-700">Автоматически исправлять ошибки</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Фиксированные кнопки внизу -->
        <div class="p-6 border-t border-gray-200">
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              class="btn btn-secondary"
              (click)="onCancel()"
            >
              Отмена
            </button>
            <button
              type="button"
              class="btn btn-primary"
              (click)="onSave()"
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ValidationSettingsModalComponent {
  @Input() settings!: ValidationSettingsDTO;
  @Output() save = new EventEmitter<ValidationSettingsDTO>();
  @Output() cancel = new EventEmitter<void>();

  onSave(): void {
    this.save.emit(this.settings);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}