import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../shared/header/header.component';
import { DirectoryService } from '../../services/directory.service';
import { DocumentDirectoryDTO, DirectoryTag } from '../../models/directory.model';
import { ConfirmModalComponent } from '../shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-directories',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, ConfirmModalComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-header />
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 sm:px-0">
          <div class="sm:flex sm:items-center">
            <div class="sm:flex-auto">
              <h1 class="text-2xl font-semibold text-gray-900">Директории</h1>
              <p class="mt-2 text-sm text-gray-700">
                Список всех директорий с документами
              </p>
            </div>
            <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <button
                class="bg-error-600 hover:bg-error-700 text-white px-4 py-2 rounded-md"
                [disabled]="!selectedDirectories.length && !directories.length"
                (click)="confirmDeleteSelected()"
              >
                {{ selectedDirectories.length ? 'Удалить выбранные' : 'Удалить все' }}
              </button>
            </div>
          </div>

          <!-- Фильтры по тегам -->
          <div class="mt-4 flex flex-wrap gap-2">
            @for (tag of tags; track tag.id) {
              <button
                class="px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200"
                [style.backgroundColor]="selectedTags.includes(tag.name) ? tag.color : 'transparent'"
                [style.color]="selectedTags.includes(tag.name) ? 'white' : 'inherit'"
                [style.border]="'2px solid ' + tag.color"
                (click)="toggleTagFilter(tag.name)"
              >
                {{ tag.name }}
              </button>
            }
            <button
              class="px-3 py-1 rounded-full text-sm font-medium border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors duration-200"
              (click)="showNewTagInput = true"
              *ngIf="!showNewTagInput"
            >
              + Добавить тег
            </button>
            @if (showNewTagInput) {
              <div class="flex items-center space-x-2">
                <input
                  type="text"
                  [(ngModel)]="newTagName"
                  (keyup.enter)="createTag()"
                  class="px-3 py-1 rounded-full text-sm border-2 border-gray-300 focus:border-primary-500 focus:outline-none"
                  placeholder="Название тега"
                >
                <button
                  class="text-primary-600 hover:text-primary-800"
                  (click)="createTag()"
                >
                  Добавить
                </button>
                <button
                  class="text-gray-400 hover:text-gray-600"
                  (click)="cancelTagCreation()"
                >
                  Отмена
                </button>
              </div>
            }
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
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Теги</th>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Создано</th>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Изменено</th>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Размер</th>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Документов</th>
                        <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span class="sr-only">Действия</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 bg-white">
                      @for (directory of filteredDirectories; track directory.id) {
                        <tr
                          (dblclick)="navigateToDocuments(directory.id)"
                          class="hover:bg-gray-50 cursor-pointer"
                        >
                          <td class="relative w-12 px-6 sm:w-16 sm:px-8">
                            <input
                              type="checkbox"
                              class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300"
                              [checked]="isSelected(directory.id)"
                              (change)="toggleSelection(directory.id)"
                            >
                          </td>
                          <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                            {{ directory.name }}
                          </td>
                          <td class="px-3 py-4">
                            <div class="flex flex-wrap gap-1">
                              @for (tag of directory.tags; track tag) {
                                <span
                                  class="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                                  [style.backgroundColor]="getTagColor(tag)"
                                >
                                  {{ tag }}
                                </span>
                              }
                              <button
                                class="px-2 py-0.5 rounded-full text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                (click)="editDirectoryTags(directory)"
                              >
                                {{ directory.tags.length ? 'Изменить' : '+ Добавить' }}
                              </button>
                            </div>
                          </td>
                          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {{ directory.creationTime | date:'dd.MM.yyyy HH:mm' }}
                          </td>
                          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {{ directory.changeTime | date:'dd.MM.yyyy HH:mm' }}
                          </td>
                          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {{ formatSize(directory.totalSizeBytes) }}
                          </td>
                          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {{ directory.documentsCount }}
                          </td>
                          <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <div class="flex justify-end space-x-2">
                              <button
                                class="text-primary-600 hover:text-primary-900"
                                (click)="navigateToDocuments(directory.id)"
                              >
                                Перейти
                              </button>
                              <button
                                class="text-error-600 hover:text-error-900"
                                (click)="confirmDelete(directory)"
                              >
                                Удалить
                              </button>
                            </div>
                          </td>
                        </tr>
                      } @empty {
                        <tr>
                          <td colspan="8" class="py-8 text-center text-gray-500">
                            Нет доступных директорий
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

    @if (directoryToDelete) {
      <app-confirm-modal
        title="Удаление директории"
        [message]="'Вы действительно хотите удалить директорию ' + directoryToDelete.name + '?'"
        confirmText="Удалить"
        cancelText="Отмена"
        (confirm)="deleteDirectory()"
        (cancel)="directoryToDelete = null"
      />
    }

    @if (showDeleteSelectedModal) {
      <app-confirm-modal
        [title]="selectedDirectories.length ? 'Удаление выбранных директорий' : 'Удаление всех директорий'"
        [message]="selectedDirectories.length ? 
          'Вы действительно хотите удалить выбранные директории (' + selectedDirectories.length + ' шт.)?' :
          'Вы действительно хотите удалить все директории?'"
        confirmText="Удалить"
        cancelText="Отмена"
        (confirm)="deleteSelected()"
        (cancel)="showDeleteSelectedModal = false"
      />
    }

    @if (directoryForTags) {
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">Теги директории</h2>
            <button 
              (click)="directoryForTags = null"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="space-y-4">
            <div class="flex flex-wrap gap-2">
              @for (tag of tags; track tag.id) {
                <button
                  class="px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200"
                  [style.backgroundColor]="isTagSelected(tag.name) ? tag.color : 'transparent'"
                  [style.color]="isTagSelected(tag.name) ? 'white' : 'inherit'"
                  [style.border]="'2px solid ' + tag.color"
                  (click)="toggleDirectoryTag(tag.name)"
                >
                  {{ tag.name }}
                </button>
              }
            </div>

            <div class="flex justify-end space-x-3">
              <button
                class="btn btn-secondary"
                (click)="directoryForTags = null"
              >
                Отмена
              </button>
              <button
                class="btn btn-primary"
                (click)="saveDirectoryTags()"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class DirectoriesComponent implements OnInit {
  directories: DocumentDirectoryDTO[] = [];
  selectedDirectories: string[] = [];
  directoryToDelete: DocumentDirectoryDTO | null = null;
  showDeleteSelectedModal = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  tags: DirectoryTag[] = [];
  selectedTags: string[] = [];
  showNewTagInput = false;
  newTagName = '';
  directoryForTags: DocumentDirectoryDTO | null = null;
  selectedDirectoryTags: string[] = [];

  constructor(
    private directoryService: DirectoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDirectories();
    this.loadTags();
  }

  get isAllSelected(): boolean {
    return this.directories.length > 0 && this.selectedDirectories.length === this.directories.length;
  }

  get filteredDirectories(): DocumentDirectoryDTO[] {
    if (!this.selectedTags.length) {
      return this.directories;
    }
    return this.directories.filter(directory =>
      this.selectedTags.every(tag => directory.tags.includes(tag))
    );
  }

  loadDirectories(): void {
    this.directoryService.getAllDirectories().subscribe({
      next: (directories) => {
        this.directories = directories;
        this.selectedDirectories = [];
      },
      error: (error) => {
        this.errorMessage = error.message || 'Ошибка при загрузке списка директорий';
      }
    });
  }

  loadTags(): void {
    this.directoryService.getAllTags().subscribe(tags => {
      this.tags = tags;
    });
  }

  formatSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  isSelected(id: string): boolean {
    return this.selectedDirectories.includes(id);
  }

  toggleSelection(id: string): void {
    const index = this.selectedDirectories.indexOf(id);
    if (index === -1) {
      this.selectedDirectories.push(id);
    } else {
      this.selectedDirectories.splice(index, 1);
    }
  }

  toggleAll(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedDirectories = this.directories.map(d => d.id);
    } else {
      this.selectedDirectories = [];
    }
  }

  toggleTagFilter(tag: string): void {
    const index = this.selectedTags.indexOf(tag);
    if (index === -1) {
      this.selectedTags.push(tag);
    } else {
      this.selectedTags.splice(index, 1);
    }
  }

  createTag(): void {
    if (this.newTagName.trim()) {
      this.directoryService.createTag(this.newTagName.trim()).subscribe(tag => {
        this.tags.push(tag);
        this.showNewTagInput = false;
        this.newTagName = '';
      });
    }
  }

  cancelTagCreation(): void {
    this.showNewTagInput = false;
    this.newTagName = '';
  }

  getTagColor(tagName: string): string {
    const tag = this.tags.find(t => t.name === tagName);
    return tag ? tag.color : '#9CA3AF';
  }

  editDirectoryTags(directory: DocumentDirectoryDTO): void {
    this.directoryForTags = directory;
    this.selectedDirectoryTags = [...directory.tags];
  }

  isTagSelected(tagName: string): boolean {
    return this.selectedDirectoryTags.includes(tagName);
  }

  toggleDirectoryTag(tagName: string): void {
    const index = this.selectedDirectoryTags.indexOf(tagName);
    if (index === -1) {
      this.selectedDirectoryTags.push(tagName);
    } else {
      this.selectedDirectoryTags.splice(index, 1);
    }
  }

  saveDirectoryTags(): void {
    if (this.directoryForTags) {
      this.directoryService.updateDirectoryTags(this.directoryForTags.id, this.selectedDirectoryTags)
        .subscribe(() => {
          if (this.directoryForTags) {
            this.directoryForTags.tags = [...this.selectedDirectoryTags];
            this.directoryForTags = null;
          }
        });
    }
  }

  confirmDelete(directory: DocumentDirectoryDTO): void {
    this.directoryToDelete = directory;
  }

  confirmDeleteSelected(): void {
    this.showDeleteSelectedModal = true;
  }

  deleteDirectory(): void {
    if (!this.directoryToDelete) return;

    this.directoryService.deleteDirectory(this.directoryToDelete.id).subscribe({
      next: () => {
        this.successMessage = `Директория ${this.directoryToDelete?.name} успешно удалена`;
        this.directories = this.directories.filter(dir => dir.id !== this.directoryToDelete?.id);
        this.directoryToDelete = null;
        this.selectedDirectories = this.selectedDirectories.filter(id => id !== this.directoryToDelete?.id);
        
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (error) => {
        this.errorMessage = error.message || 'Ошибка при удалении директории';
        this.directoryToDelete = null;
      }
    });
  }

  deleteSelected(): void {
    const ids = this.selectedDirectories.length ? this.selectedDirectories : this.directories.map(d => d.id);
    
    (this.selectedDirectories.length ? 
      this.directoryService.deleteSelectedDirectories(ids) : 
      this.directoryService.deleteAllDirectories()
    ).subscribe({
      next: () => {
        this.successMessage = this.selectedDirectories.length ? 
          `Выбранные директории успешно удалены` :
          'Все директории успешно удалены';
        this.directories = this.directories.filter(dir => !ids.includes(dir.id));
        this.selectedDirectories = [];
        this.showDeleteSelectedModal = false;
        
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (error) => {
        this.errorMessage = error.message || 'Ошибка при удалении директорий';
        this.showDeleteSelectedModal = false;
      }
    });
  }

  navigateToDocuments(directoryId: string): void {
    this.router.navigate(['/documents', directoryId]);
  }
}