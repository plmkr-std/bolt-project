import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../shared/header/header.component';
import { ValidationService } from '../../services/validation.service';
import { ValidationSettingsDTO, ValidationResponseDTO } from '../../models/validation.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-header />
      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">Проверка документа</h2>

            <!-- Основной контент -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Область загрузки файла -->
              <div>
                <div
                  class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
                  [class.border-primary-500]="isDragging"
                  [class.bg-primary-50]="isDragging"
                  (dragover)="onDragOver($event)"
                  (dragleave)="onDragLeave($event)"
                  (drop)="onDrop($event)"
                >
                  @if (selectedFile) {
                    <div class="space-y-2">
                      <div class="flex items-center justify-center text-primary-600">
                        <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p class="text-sm font-medium text-gray-900">{{ selectedFile.name }}</p>
                      <p class="text-xs text-gray-500">{{ (selectedFile.size / 1024 / 1024).toFixed(2) }} MB</p>
                      <button
                        class="text-sm text-error-600 hover:text-error-800"
                        (click)="removeFile()"
                      >
                        Удалить файл
                      </button>
                    </div>
                  } @else {
                    <div class="space-y-2">
                      <div class="flex items-center justify-center text-gray-400">
                        <svg class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <p class="text-gray-600">
                        Перетащите файл сюда или
                        <label class="text-primary-600 hover:text-primary-800 cursor-pointer">
                          выберите файл
                          <input
                            type="file"
                            class="hidden"
                            accept=".docx"
                            (change)="onFileSelected($event)"
                          >
                        </label>
                      </p>
                      <p class="text-sm text-gray-500">Только файлы .docx</p>
                    </div>
                  }
                </div>

                @if (validationResponse) {
                  <div class="mt-4 p-4 rounded-lg" [class.bg-success-50]="validationResponse.success" [class.bg-error-50]="!validationResponse.success">
                    <p class="font-medium" [class.text-success-700]="validationResponse.success" [class.text-error-700]="!validationResponse.success">
                      {{ validationResponse.message }}
                    </p>
                  </div>
                }
              </div>

              <!-- Настройки валидации -->
              <div class="space-y-6">
                <h3 class="text-lg font-medium text-gray-900">Настройки проверки</h3>

                <!-- Настройки раздела -->
                <div class="space-y-4">
                  <h4 class="text-sm font-medium text-gray-700">Настройки раздела</h4>
                  
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
                      <option value="standard">Стандартный (2см везде)</option>
                      <option value="wide">Широкий (3см слева)</option>
                      <option value="narrow">Узкий (1.5см везде)</option>
                    </select>
                  </div>
                </div>

                <!-- Настройки параграфа -->
                <div class="space-y-4">
                  <h4 class="text-sm font-medium text-gray-700">Настройки параграфа</h4>
                  
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

                <!-- Настройки текста -->
                <div class="space-y-4">
                  <h4 class="text-sm font-medium text-gray-700">Настройки текста</h4>
                  
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

                  <div class="grid grid-cols-2 gap-4">
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

                    <div class="space-y-2">
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

                <!-- Структурные элементы -->
                <div class="space-y-4">
                  <h4 class="text-sm font-medium text-gray-700">Структурные элементы</h4>
                  
                  <div class="space-y-2">
                    <div class="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        [checked]="settings.structureElements.includes('title')"
                        (change)="toggleStructureElement('title')"
                        class="form-checkbox"
                      >
                      <span class="text-sm text-gray-700">Титульный лист</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        [checked]="settings.structureElements.includes('contents')"
                        (change)="toggleStructureElement('contents')"
                        class="form-checkbox"
                      >
                      <span class="text-sm text-gray-700">Оглавление</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        [checked]="settings.structureElements.includes('bibliography')"
                        (change)="toggleStructureElement('bibliography')"
                        class="form-checkbox"
                      >
                      <span class="text-sm text-gray-700">Список литературы</span>
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

            <!-- Кнопка валидации -->
            <div class="mt-6 flex justify-end">
              <button
                class="btn btn-primary"
                [disabled]="!selectedFile || isValidating"
                (click)="validateDocument()"
              >
                <span>{{ isValidating ? 'Проверка...' : 'Проверить документ' }}</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  `
})
export class DashboardComponent {
  isDragging = false;
  selectedFile: File | null = null;
  isValidating = false;
  validationResponse: ValidationResponseDTO | null = null;

  settings: ValidationSettingsDTO = {
    sectionSettings: {
      pageFormat: 'A4',
      fieldTemplate: 'standard'
    },
    paragraphSettings: {
      firstLine: 1.25,
      lineSpacing: 1.5,
      intervalBeforeSpacing: 0,
      intervalAfterSpacing: 0
    },
    textSettings: {
      fontStyle: 'Times New Roman',
      leftBorderFontSize: 12,
      rightBorderFontSize: 14
    },
    structureElements: ['title', 'contents'],
    toFix: false
  };

  constructor(private validationService: ValidationService) {}

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files?.length) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.handleFile(input.files[0]);
    }
  }

  handleFile(file: File): void {
    if (!file.name.endsWith('.docx')) {
      alert('Пожалуйста, выберите файл формата .docx');
      return;
    }

    this.selectedFile = file;
    this.validationResponse = null;
  }

  removeFile(): void {
    this.selectedFile = null;
    this.validationResponse = null;
  }

  toggleStructureElement(element: string): void {
    const index = this.settings.structureElements.indexOf(element);
    if (index === -1) {
      this.settings.structureElements.push(element);
    } else {
      this.settings.structureElements.splice(index, 1);
    }
  }

  validateDocument(): void {
    if (!this.selectedFile) return;

    this.isValidating = true;
    this.validationResponse = null;

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('settings', JSON.stringify(this.settings));

    this.validationService.validateDocument(this.selectedFile, this.settings)
      .subscribe({
        next: (response) => {
          this.validationResponse = response;
          this.isValidating = false;
        },
        error: (error) => {
          console.error('Ошибка валидации:', error);
          this.isValidating = false;
          this.validationResponse = {
            success: false,
            message: 'Произошла ошибка при проверке документа'
          };
        }
      });
  }
}