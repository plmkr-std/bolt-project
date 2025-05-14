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
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <!-- Заголовок -->
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900">Настройки проверки</h2>
            <button
              class="text-gray-400 hover:text-gray-500"
              (click)="onCancel()"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Содержимое -->
        <div class="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div class="space-y-6">
            <!-- Настройки страницы -->
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-4">Настройки страницы</h3>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="form-label">Формат страницы</label>
                  <select
                    class="form-input"
                    [(ngModel)]="tempSettings.sectionSettings.pageFormat"
                  >
                    <option value="A4">A4</option>
                    <option value="A5">A5</option>
                    <option value="Letter">Letter</option>
                  </select>
                </div>
                <div>
                  <label class="form-label">Шаблон полей</label>
                  <select
                    class="form-input"
                    [(ngModel)]="tempSettings.sectionSettings.fieldTemplate"
                  >
                    <option value="standard">Стандартный</option>
                    <option value="wide">Широкий</option>
                    <option value="narrow">Узкий</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Настройки текста -->
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-4">Настройки текста</h3>
              <div class="space-y-4">
                <div>
                  <label class="form-label">Стиль шрифта</label>
                  <select
                    class="form-input w-full"
                    [(ngModel)]="tempSettings.textSettings.fontStyle"
                  >
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Arial">Arial</option>
                    <option value="Calibri">Calibri</option>
                  </select>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="form-label">Мин. размер шрифта (pt)</label>
                    <input
                      type="number"
                      class="form-input"
                      [(ngModel)]="tempSettings.textSettings.leftBorderFontSize"
                      min="8"
                      max="72"
                    >
                  </div>
                  <div>
                    <label class="form-label">Макс. размер шрифта (pt)</label>
                    <input
                      type="number"
                      class="form-input"
                      [(ngModel)]="tempSettings.textSettings.rightBorderFontSize"
                      min="8"
                      max="72"
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Настройки параграфа -->
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-4">Настройки параграфа</h3>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="form-label">Отступ первой строки (см)</label>
                  <input
                    type="number"
                    class="form-input"
                    [(ngModel)]="tempSettings.paragraphSettings.firstLine"
                    min="0"
                    step="0.25"
                  >
                </div>
                <div>
                  <label class="form-label">Межстрочный интервал</label>
                  <select
                    class="form-input"
                    [(ngModel)]="tempSettings.paragraphSettings.lineSpacing"
                  >
                    <option [ngValue]="1">Одинарный</option>
                    <option [ngValue]="1.15">1,15</option>
                    <option [ngValue]="1.5">Полуторный</option>
                    <option [ngValue]="2">Двойной</option>
                  </select>
                </div>
                <div>
                  <label class="form-label">Интервал перед (пт)</label>
                  <input
                    type="number"
                    class="form-input"
                    [(ngModel)]="tempSettings.paragraphSettings.intervalBeforeSpacing"
                    min="0"
                  >
                </div>
                <div>
                  <label class="form-label">Интервал после (пт)</label>
                  <input
                    type="number"
                    class="form-input"
                    [(ngModel)]="tempSettings.paragraphSettings.intervalAfterSpacing"
                    min="0"
                  >
                </div>
              </div>
            </div>

            

            <!-- Дополнительные настройки -->
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-4">Дополнительные настройки</h3>
              <label class="inline-flex items-center">
                <input
                  type="checkbox"
                  class="form-checkbox"
                  [(ngModel)]="tempSettings.toFix"
                >
                <span class="ml-2">Автоматически исправлять найденные ошибки</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Футер -->
        <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            class="btn btn-secondary"
            (click)="onCancel()"
          >
            Отмена
          </button>
          <button
            class="btn btn-primary"
            (click)="onSave()"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  `
})
export class ValidationSettingsModalComponent {
  @Input() settings!: ValidationSettingsDTO;
  @Output() save = new EventEmitter<ValidationSettingsDTO>();
  @Output() cancel = new EventEmitter<void>();

  tempSettings!: ValidationSettingsDTO;

  ngOnInit() {
    this.tempSettings = JSON.parse(JSON.stringify(this.settings));
  }

  toggleStructureElement(element: string): void {
    const index = this.tempSettings.structureElements.indexOf(element);
    if (index === -1) {
      this.tempSettings.structureElements.push(element);
    } else {
      this.tempSettings.structureElements.splice(index, 1);
    }
  }

  onSave(): void {
    this.save.emit(this.tempSettings);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}