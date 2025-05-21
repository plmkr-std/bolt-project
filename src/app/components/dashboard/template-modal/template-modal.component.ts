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
      <div class="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
        <div class="p-6 border-b">
          <div class="flex justify-between items-center">
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
        </div>

        <div class="p-6 overflow-y-auto flex-1">
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
            <div class="space-y-3">
              @for (template of templates; track template._id) {
                <div
                  class="p-3 border rounded-lg hover:border-primary-500 cursor-pointer transition-colors duration-200"
                  [class.border-primary-500]="selectedTemplate?._id === template._id"
                  [class.bg-primary-50]="selectedTemplate?._id === template._id"
                  (click)="selectTemplate(template)"
                >
                  <div class="flex justify-between items-start mb-2">
                    <div>
                      <h3 class="font-medium text-gray-900">{{ template.name }}</h3>
                      <p class="text-xs text-gray-500">
                        Создан: {{ template.createdAt | date:'dd.MM.yyyy HH:mm' }}
                      </p>
                    </div>
                    <button
                      class="text-error-600 hover:text-error-800 text-sm"
                      (click)="deleteTemplate(template._id, $event)"
                    >
                      Удалить
                    </button>
                  </div>

                  <div class="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <h4 class="font-medium text-gray-700 text-xs mb-1">Страница</h4>
                      <div class="text-xs text-gray-600">
                        {{ template.settings.sectionSettings.pageTemplate }},
                        поля: {{ template.settings.sectionSettings.fieldTemplate }}
                      </div>
                    </div>

                    <div>
                      <h4 class="font-medium text-gray-700 text-xs mb-1">Текст</h4>
                      <div class="text-xs text-gray-600">
                        {{ template.settings.textSettings.fontStyle }},
                        {{ template.settings.textSettings.leftBorderSize }}-{{ template.settings.textSettings.rightBorderSize }}pt
                      </div>
                    </div>

                    <div>
                      <h4 class="font-medium text-gray-700 text-xs mb-1">Параграф</h4>
                      <div class="text-xs text-gray-600">
                        Отступ: {{ template.settings.paragraphSettings.firstLine }}см,
                        интервал: {{ template.settings.paragraphSettings.lineSpacing }}
                      </div>
                    </div>

                    <div>
                      <h4 class="font-medium text-gray-700 text-xs mb-1">Дополнительно</h4>
                      <div class="text-xs text-gray-600">
                        Автоисправление: {{ template.settings.autofix ? 'Вкл' : 'Выкл' }}
                      </div>
                    </div>
                  </div>
                </div>
              } @empty {
                <p class="text-center text-gray-500 py-4">Нет доступных шаблонов</p>
              }
            </div>
          }
        </div>

        <div class="p-6 border-t bg-gray-50">
          <div class="flex justify-between items-center">
            @if (!isCreating) {
              <button
                class="btn btn-secondary text-sm"
                (click)="startCreating()"
              >
                Создать шаблон
              </button>
            }
            <div class="flex space-x-3 ml-auto">
              <button
                class="btn btn-secondary text-sm"
                (click)="onClose()"
              >
                Отмена
              </button>
              <button
                class="btn btn-primary text-sm"
                [disabled]="isCreating ? !newTemplateName : !selectedTemplate"
                (click)="onSave()"
              >
                {{ isCreating ? 'Создать' : 'Выбрать' }}
              </button>
            </div>
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