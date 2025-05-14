import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';
import { ConfirmModalComponent } from '../shared/confirm-modal/confirm-modal.component';
import { ValidatedDocumentDTO } from '../../models/document.model';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, HeaderComponent, ConfirmModalComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-header />
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 sm:px-0">
          <div class="sm:flex sm:items-center">
            <div class="sm:flex-auto">
              <h1 class="text-2xl font-semibold text-gray-900">Документы</h1>
              <p class="mt-2 text-sm text-gray-700">
                Список всех документов в директории
              </p>
            </div>
            <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <button
                class="bg-error-600 hover:bg-error-700 text-white px-4 py-2 rounded-md"
                [disabled]="!selectedDocuments.length && !documents.length"
                (click)="confirmDeleteSelected()"
              >
                {{ selectedDocuments.length ? 'Удалить выбранные' : 'Удалить все' }}
              </button>
            </div>
          </div>

          @if (errorMessage) {
            <div class="mt-4 bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-md">
              {{ errorMessage }}
            </div>
          }

          @if (successMessage) {
            <div class="mt-4 bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-md">
              {{ successMessage }}
            </div>
          }

          <div class="mt-8 flex flex-col">
            <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table class="min-w-full divide-y divide-gray-300">
                    <thead class="bg-gray-50">
                      <tr>
                        <th scope="col" class="relative w-12 px-6 sm:w-16 sm:px-8">
                          <input
                            type="checkbox"
                            class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300"
                            [checked]="isAllSelected"
                            (change)="toggleAll($event)"
                          >
                        </th>
                        <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Название</th>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Создано</th>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Размер</th>
                        <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span class="sr-only">Действия</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 bg-white">
                      @for (document of documents; track document.id) {
                        <tr class="hover:bg-gray-50">
                          <td class="relative w-12 px-6 sm:w-16 sm:px-8">
                            <input
                              type="checkbox"
                              class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300"
                              [checked]="isSelected(document.id)"
                              (change)="toggleSelection(document.id)"
                            >
                          </td>
                          <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                            {{ document.name }}
                          </td>
                          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {{ document.creationTime | date:'dd.MM.yyyy HH:mm' }}
                          </td>
                          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {{ formatSize(document.sizeBytes) }}
                          </td>
                          <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <div class="flex justify-end space-x-2">
                              <button
                                class="text-primary-600 hover:text-primary-900"
                                (click)="showStats(document)"
                              >
                                Статистика
                              </button>
                              <button
                                class="text-primary-600 hover:text-primary-900"
                                (click)="downloadDocument(document)"
                              >
                                Скачать
                              </button>
                              <button
                                class="text-error-600 hover:text-error-900"
                                (click)="confirmDelete(document)"
                              >
                                Удалить
                              </button>
                            </div>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    @if (documentToDelete) {
      <app-confirm-modal
        title="Удаление документа"
        [message]="'Вы действительно хотите удалить документ ' + documentToDelete.name + '?'"
        confirmText="Удалить"
        cancelText="Отмена"
        (confirm)="deleteDocument()"
        (cancel)="documentToDelete = null"
      />
    }

    @if (showDeleteSelectedModal) {
      <app-confirm-modal
        [title]="selectedDocuments.length ? 'Удаление выбранных документов' : 'Удаление всех документов'"
        [message]="selectedDocuments.length ? 
          'Вы действительно хотите удалить выбранные документы (' + selectedDocuments.length + ' шт.)?' :
          'Вы действительно хотите удалить все документы?'"
        confirmText="Удалить"
        cancelText="Отмена"
        (confirm)="deleteSelected()"
        (cancel)="showDeleteSelectedModal = false"
      />
    }

    @if (selectedStats) {
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">Статистика проверки</h2>
            <button 
              (click)="selectedStats = null"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          @if (selectedStats.validationStats) {
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-gray-50 p-3 rounded-lg">
                  <div class="text-sm text-gray-500">Всего проверок</div>
                  <div class="text-lg font-semibold text-gray-900">{{ selectedStats.validationStats.totalChecks }}</div>
                </div>
                <div class="bg-gray-50 p-3 rounded-lg">
                  <div class="text-sm text-gray-500">Пройдено</div>
                  <div class="text-lg font-semibold text-gray-900">{{ selectedStats.validationStats.passedChecks }}</div>
                </div>
                <div class="bg-gray-50 p-3 rounded-lg">
                  <div class="text-sm text-gray-500">Ошибок</div>
                  <div class="text-lg font-semibold text-gray-900">{{ selectedStats.validationStats.failedChecks }}</div>
                </div>
                <div class="bg-gray-50 p-3 rounded-lg">
                  <div class="text-sm text-gray-500">Время проверки</div>
                  <div class="text-lg font-semibold text-gray-900">{{ selectedStats.validationStats.durationMs }}мс</div>
                </div>
                <div class="bg-gray-50 p-3 rounded-lg">
                  <div class="text-sm text-gray-500">Комментарии</div>
                  <div class="text-lg font-semibold text-gray-900">{{ selectedStats.validationStats.commentsCount }}</div>
                </div>
                <div class="bg-gray-50 p-3 rounded-lg">
                  <div class="text-sm text-gray-500">Исправления</div>
                  <div class="text-lg font-semibold text-gray-900">{{ selectedStats.validationStats.fixCount }}</div>
                </div>
              </div>
            </div>
          } @else {
            <p class="text-gray-500">Статистика проверки недоступна</p>
          }
        </div>
      </div>
    }
  `
})
export class DocumentsComponent implements OnInit {
  documents: ValidatedDocumentDTO[] = [];
  selectedDocuments: string[] = [];
  documentToDelete: ValidatedDocumentDTO | null = null;
  showDeleteSelectedModal = false;
  selectedStats: ValidatedDocumentDTO | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const creationTimes = [
      '2025-05-15T15:30:00',
      '2025-05-14T10:45:22',
      '2025-05-13T16:20:45',
      '2025-05-12T09:15:33',
      '2025-05-11T14:40:18'
    ];

    this.documents = Array.from({ length: 5 }, (_, i) => ({
      id: `doc-${i + 1}`,
      name: `Публикация Макаров_validated_${new Date(creationTimes[i]).getTime()}`,
      creationTime: creationTimes[i],
      sizeBytes: Math.random() * 10000000 + 1000000,
      validationStats: {
        totalChecks: Math.floor(Math.random() * 20) + 10,
        passedChecks: Math.floor(Math.random() * 15) + 5,
        failedChecks: Math.floor(Math.random() * 5),
        durationMs: Math.floor(Math.random() * 2000) + 500,
        commentsCount: Math.floor(Math.random() * 10),
        fixCount: Math.floor(Math.random() * 5)
      }
    }));
  }

  get isAllSelected(): boolean {
    return this.documents.length > 0 && this.selectedDocuments.length === this.documents.length;
  }

  formatSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  isSelected(id: string): boolean {
    return this.selectedDocuments.includes(id);
  }

  toggleSelection(id: string): void {
    const index = this.selectedDocuments.indexOf(id);
    if (index === -1) {
      this.selectedDocuments.push(id);
    } else {
      this.selectedDocuments.splice(index, 1);
    }
  }

  toggleAll(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedDocuments = this.documents.map(d => d.id);
    } else {
      this.selectedDocuments = [];
    }
  }

  showStats(document: ValidatedDocumentDTO): void {
    this.selectedStats = document;
  }

  downloadDocument(document: ValidatedDocumentDTO): void {
    // В реальном приложении здесь будет логика скачивания
    console.log('Downloading document:', document.name);
  }

  confirmDelete(document: ValidatedDocumentDTO): void {
    this.documentToDelete = document;
  }

  confirmDeleteSelected(): void {
    this.showDeleteSelectedModal = true;
  }

  deleteDocument(): void {
    if (!this.documentToDelete) return;

    this.documents = this.documents.filter(doc => doc.id !== this.documentToDelete?.id);
    this.selectedDocuments = this.selectedDocuments.filter(id => id !== this.documentToDelete?.id);
    this.successMessage = `Документ ${this.documentToDelete.name} успешно удален`;
    this.documentToDelete = null;

    setTimeout(() => {
      this.successMessage = null;
    }, 3000);
  }

  deleteSelected(): void {
    const ids = this.selectedDocuments.length ? this.selectedDocuments : this.documents.map(d => d.id);
    
    this.documents = this.documents.filter(doc => !ids.includes(doc.id));
    this.selectedDocuments = [];
    this.showDeleteSelectedModal = false;
    
    this.successMessage = this.selectedDocuments.length ? 
      'Выбранные документы успешно удалены' :
      'Все документы успешно удалены';

    setTimeout(() => {
      this.successMessage = null;
    }, 3000);
  }
}