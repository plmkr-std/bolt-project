import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../shared/header/header.component';
import { ValidationService } from '../../services/validation.service';
import { ValidationSettingsDTO, ValidationResponseDTO } from '../../models/validation.model';
import { ValidationSettingsModalComponent } from './validation-settings-modal/validation-settings-modal.component';
import { TemplateModalComponent } from './template-modal/template-modal.component';
import { ValidationTemplateDTO } from '../../models/validation-template.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, ValidationSettingsModalComponent, TemplateModalComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-header />
      <main class="max-w-7xl mx-auto py-2 sm:px-6 lg:px-8">
        <div class="px-4 py-2 sm:px-0">
          <div class="bg-white rounded-lg shadow p-4">
            <h2 class="text-xl font-bold text-gray-800 mb-4">Проверка документа</h2>

            <!-- Основной контент -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Левая колонка: Загрузка файла и результаты -->
              <div class="space-y-4">
                <!-- Область загрузки файла -->
                <div
                  class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center"
                  [class.border-primary-500]="isDragging"
                  [class.bg-primary-50]="isDragging"
                  (dragover)="onDragOver($event)"
                  (dragleave)="onDragLeave($event)"
                  (drop)="onDrop($event)"
                >
                  @if (selectedFile) {
                    <div class="space-y-1">
                      <div class="flex items-center justify-center text-primary-600">
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                    <div class="space-y-1">
                      <div class="flex items-center justify-center text-gray-400">
                        <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <p class="text-gray-600 text-sm">
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
                      <p class="text-xs text-gray-500">Только файлы .docx</p>
                    </div>
                  }
                </div>

                <!-- Результаты проверки -->
                @if (validationResponse) {
                  <div class="bg-white rounded-lg border shadow-sm">
                    <div class="p-3 border-b">
                      <h3 class="text-base font-semibold text-gray-900">Результаты проверки</h3>
                    </div>
                    <div class="p-3 space-y-3">
                      <!-- Статус проверки -->
                      <div class="flex items-center" [class.text-success-600]="validationResponse.success" [class.text-error-600]="!validationResponse.success">
                        <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          @if (validationResponse.success) {
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          } @else {
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          }
                        </svg>
                        <span class="text-sm font-medium">{{ validationResponse.message }}</span>
                      </div>

                      @if (validationResponse.data) {
                        <!-- Прогресс бар -->
                        <div class="space-y-1">
                          <div class="flex justify-between text-xs">
                            <span class="text-gray-600">Пройдено проверок</span>
                            <span class="font-medium">{{ validationResponse.data.passedChecks }} из {{ validationResponse.data.totalChecks }}</span>
                          </div>
                          <div class="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              class="h-full rounded-full transition-all duration-500"
                              [style.width.%]="(validationResponse.data.passedChecks / validationResponse.data.totalChecks) * 100"
                              [class.bg-success-500]="validationResponse.data.failedChecks === 0"
                              [class.bg-warning-500]="validationResponse.data.failedChecks > 0 && validationResponse.data.failedChecks <= 3"
                              [class.bg-error-500]="validationResponse.data.failedChecks > 3"
                            ></div>
                          </div>
                        </div>

                        <!-- Статистика -->
                        <div class="grid grid-cols-2 gap-2 mt-2">
                          <div class="bg-gray-50 p-2 rounded">
                            <div class="text-xs text-gray-500">Время проверки</div>
                            <div class="text-sm font-semibold text-gray-900">{{ validationResponse.data.durationMs }}мс</div>
                          </div>
                          <div class="bg-gray-50 p-2 rounded">
                            <div class="text-xs text-gray-500">Комментарии</div>
                            <div class="text-sm font-semibold text-gray-900">{{ validationResponse.data.commentsCount }}</div>
                          </div>
                          <div class="bg-gray-50 p-2 rounded">
                            <div class="text-xs text-gray-500">Исправления</div>
                            <div class="text-sm font-semibold text-gray-900">{{ validationResponse.data.fixCount }}</div>
                          </div>
                          <div class="bg-gray-50 p-2 rounded">
                            <div class="text-xs text-gray-500">Ошибки</div>
                            <div class="text-sm font-semibold text-gray-900">{{ validationResponse.data.failedChecks }}</div>
                          </div>
                        </div>

                        <!-- Кнопка скачивания -->
                        <div class="mt-3">
                          <button
                            class="btn btn-primary w-full flex items-center justify-center text-sm py-1.5"
                            (click)="downloadDocument()"
                          >
                            <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Скачать проверенный документ
                          </button>
                        </div>
                      }
                    </div>
                  </div>
                }
              </div>

              <!-- Правая колонка: Настройки -->
              <div class="space-y-4">
                <h3 class="text-base font-medium text-gray-900">Настройки проверки</h3>

                <!-- Текущие настройки -->
                <div class="space-y-3">
                  <div>
                    <h4 class="text-xs font-medium text-gray-700">Формат страницы</h4>
                    <p class="text-sm text-gray-600">{{ settings.sectionSettings.pageFormat }}</p>
                  </div>

                  <div>
                    <h4 class="text-xs font-medium text-gray-700">Шаблон полей</h4>
                    <p class="text-sm text-gray-600">{{ settings.sectionSettings.fieldTemplate }}</p>
                  </div>

                  <div>
                    <h4 class="text-xs font-medium text-gray-700">Шрифт</h4>
                    <p class="text-sm text-gray-600">{{ settings.textSettings.fontStyle }} ({{ settings.textSettings.leftBorderFontSize }}-{{ settings.textSettings.rightBorderFontSize }}pt)</p>
                  </div>

                  <div>
                    <h4 class="text-xs font-medium text-gray-700">Параграф</h4>
                    <p class="text-sm text-gray-600">
                      Отступ: {{ settings.paragraphSettings.firstLine }}см,
                      Интервал: {{ settings.paragraphSettings.lineSpacing }}
                    </p>
                  </div>

                  <div>
                    <h4 class="text-xs font-medium text-gray-700">Автоисправление</h4>
                    <p class="text-sm text-gray-600">{{ settings.toFix ? 'Включено' : 'Выключено' }}</p>
                  </div>
                </div>

                <!-- Кнопки управления -->
                <div class="flex justify-end space-x-2">
                  <button
                    class="px-2 py-1 text-sm btn btn-secondary"
                    (click)="showTemplateModal = true"
                  >
                    Выбрать шаблон
                  </button>
                  <button
                    class="px-2 py-1 text-sm btn btn-secondary"
                    (click)="showSettingsModal = true"
                  >
                    Изменить настройки
                  </button>
                  <button
                    class="px-2 py-1 text-sm btn btn-primary"
                    [disabled]="!selectedFile || isValidating"
                    (click)="validateDocument()"
                  >
                    <span>{{ isValidating ? 'Проверка...' : 'Проверить' }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    @if (showSettingsModal) {
      <app-validation-settings-modal
        [settings]="settings"
        (save)="onSettingsSave($event)"
        (cancel)="showSettingsModal = false"
      />
    }

    @if (showTemplateModal) {
      <app-template-modal
        [currentSettings]="settings"
        (select)="onTemplateSelect($event)"
        (close)="showTemplateModal = false"
      />
    }
  `
})
export class DashboardComponent {
  isDragging = false;
  selectedFile: File | null = null;
  isValidating = false;
  validationResponse: ValidationResponseDTO | null = null;
  showSettingsModal = false;
  showTemplateModal = false;

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

  onSettingsSave(newSettings: ValidationSettingsDTO): void {
    this.settings = { ...newSettings };
    this.showSettingsModal = false;
  }

  onTemplateSelect(template: ValidationTemplateDTO): void {
    this.settings = {
      sectionSettings: {
        pageFormat: template.settings.sectionSettings.pageTemplate,
        fieldTemplate: template.settings.sectionSettings.fieldTemplate
      },
      paragraphSettings: {
        firstLine: template.settings.paragraphSettings.firstLine,
        lineSpacing: template.settings.paragraphSettings.lineSpacing,
        intervalBeforeSpacing: template.settings.paragraphSettings.intervalBeforeSpacing,
        intervalAfterSpacing: template.settings.paragraphSettings.intervalAfterSpacing
      },
      textSettings: {
        fontStyle: template.settings.textSettings.fontStyle,
        leftBorderFontSize: template.settings.textSettings.leftBorderSize,
        rightBorderFontSize: template.settings.textSettings.rightBorderSize
      },
      structureElements: ['title', 'contents'],
      toFix: template.settings.autofix
    };
    this.showTemplateModal = false;
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

  downloadDocument(): void {
    if (!this.selectedFile) return;

    // В реальном приложении здесь будет запрос к API для получения проверенного документа
    // Сейчас просто скачиваем исходный файл
    const url = URL.createObjectURL(this.selectedFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = `checked_${this.selectedFile.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}