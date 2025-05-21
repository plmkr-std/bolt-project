import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ValidationTemplateDTO } from '../../../models/validation-template.model';
import { ValidationTemplateService } from '../../../services/validation-template.service';
import { ValidationSettingsDTO } from '../../../models/validation.model';

@Component({
  selector: 'app-template-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold">{{ isCreating ? 'Создать шаблон' : 'Выбрать шаблон' }}</h2>
          <button 
            (click)="onClose()"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        @if (isCreating) {
          <div class="mb-6">
            <label class="form-label">Название шаблона</label>
            <input
              type="text"
              class="form-input"
              [(ngModel)]="newTemplateName"
              placeholder="Введите название шаблона"
            >
          </div>
        } @else {
          <div class="space-y-4">
            @for (template of templates; track template._id) {
              <div
                class="p-4 border rounded-lg hover:border-primary-500 cursor-pointer transition-colors duration-200"
                [class.border-primary-500]="selectedTemplate?._id === template._id"
                [class.bg-primary-50]="selectedTemplate?._id === template._id"
                (click)="selectTemplate(template)"
              >
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <h3 class="font-medium text-gray-900">{{ template.name }}</h3>
                    <p class="text-sm text-gray-500 mt-1">
                      Создан: {{ template.createdAt | date:'dd.MM.yyyy HH:mm' }}
                    </p>
                  </div>
                  <button
                    class="text-error-600 hover:text-error-800"
                    (click)="deleteTemplate(template._id, $event)"
                  >
                    Удалить
                  </button>
                </div>

                <div class="grid grid-cols-2 gap-4 text-sm">
                  <!-- Настройки страницы -->
                  <div>
                    <h4 class="font-medium text-gray-700 mb-1">Настройки страницы</h4>
                    <ul class="space-y-1 text-gray-600">
                      <li>Формат: {{ template.settings.sectionSettings.pageTemplate }}</li>
                      <li>Поля: {{ template.settings.sectionSettings.fieldTemplate }}</li>
                    </ul>
                  </div>

                  <!-- Настройки текста -->
                  <div>
                    <h4 class="font-medium text-gray-700 mb-1">Настройки текста</h4>
                    <ul class="space-y-1 text-gray-600">
                      <li>Шрифт: {{ template.settings.textSettings.fontStyle }}</li>
                      <li>Размер: {{ template.settings.textSettings.leftBorderSize }}-{{ template.settings.textSettings.rightBorderSize }}pt</li>
                    </ul>
                  </div>

                  <!-- Настройки параграфа -->
                  <div>
                    <h4 class="font-medium text-gray-700 mb-1">Настройки параграфа</h4>
                    <ul class="space-y-1 text-gray-600">
                      <li>Отступ: {{ template.settings.paragraphSettings.firstLine }}см</li>
                      <li>Интервал: {{ template.settings.paragraphSettings.lineSpacing }}</li>
                      <li>Интервал до: {{ template.settings.paragraphSettings.intervalBeforeSpacing }}пт</li>
                      <li>Интервал после: {{ template.settings.paragraphSettings.intervalAfterSpacing }}пт</li>
                    </ul>
                  </div>

                  <!-- Дополнительные настройки -->
                  <div>
                    <h4 class="font-medium text-gray-700 mb-1">Дополнительно</h4>
                    <ul class="space-y-1 text-gray-600">
                      <li>Автоисправление: {{ template.settings.autofix ? 'Включено' : 'Выключено' }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            } @empty {
              <p class="text-center text-gray-500 py-4">Нет доступных шаблонов</p>
            }
          </div>
        }

        <div class="flex justify-between mt-6 pt-6 border-t">
          @if (!isCreating) {
            <button
              class="btn btn-secondary"
              (click)="startCreating()"
            >
              Создать шаблон
            </button>
          }
          <div class="flex space-x-3 ml-auto">
            <button
              class="btn btn-secondary"
              (click)="onClose()"
            >
              Отмена
            </button>
            <button
              class="btn btn-primary"
              [disabled]="isCreating ? !newTemplateName : !selectedTemplate"
              (click)="onSave()"
            >
              {{ isCreating ? 'Создать' : 'Выбрать' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TemplateModalComponent {
  @Input() currentSettings!: ValidationSettingsDTO;
  @Output() close = new EventEmitter<void>();
  @Output() select = new EventEmitter<ValidationTemplateDTO>();

  templates: ValidationTemplateDTO[] = [];
  selectedTemplate: ValidationTemplateDTO | null = null;
  isCreating = false;
  newTemplateName = '';

  constructor(private templateService: ValidationTemplateService) {
    this.loadTemplates();
  }

  loadTemplates(): void {
    this.templateService.getTemplates().subscribe(templates => {
      this.templates = templates;
    });
  }

  selectTemplate(template: ValidationTemplateDTO): void {
    this.selectedTemplate = template;
  }

  startCreating(): void {
    this.isCreating = true;
    this.selectedTemplate = null;
  }

  deleteTemplate(id: string, event: Event): void {
    event.stopPropagation();
    this.templateService.deleteTemplate(id).subscribe(() => {
      this.loadTemplates();
      if (this.selectedTemplate?._id === id) {
        this.selectedTemplate = null;
      }
    });
  }

  onSave(): void {
    if (this.isCreating) {
      const newTemplate = {
        name: this.newTemplateName,
        settings: {
          sectionSettings: {
            pageTemplate: this.currentSettings.sectionSettings.pageFormat,
            fieldTemplate: this.currentSettings.sectionSettings.fieldTemplate
          },
          paragraphSettings: {
            firstLine: this.currentSettings.paragraphSettings.firstLine,
            lineSpacing: this.currentSettings.paragraphSettings.lineSpacing,
            intervalBeforeSpacing: this.currentSettings.paragraphSettings.intervalBeforeSpacing,
            intervalAfterSpacing: this.currentSettings.paragraphSettings.intervalAfterSpacing
          },
          textSettings: {
            fontStyle: this.currentSettings.textSettings.fontStyle,
            leftBorderSize: this.currentSettings.textSettings.leftBorderFontSize,
            rightBorderSize: this.currentSettings.textSettings.rightBorderFontSize
          },
          autofix: this.currentSettings.toFix
        }
      };

      this.templateService.createTemplate(newTemplate).subscribe(template => {
        this.loadTemplates();
        this.onClose();
      });
    } else if (this.selectedTemplate) {
      this.select.emit(this.selectedTemplate);
    }
  }

  onClose(): void {
    this.close.emit();
  }
}