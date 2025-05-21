import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/header/header.component';
import { AuditLogDTO, AuditLogFilter } from '../../../models/audit.model';

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-header />
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 sm:px-0">
          <div class="sm:flex sm:items-center">
            <div class="sm:flex-auto">
              <h1 class="text-2xl font-semibold text-gray-900">История действий пользователя</h1>
              <p class="mt-2 text-sm text-gray-700">
                {{ username ? username : 'Загрузка...' }}
              </p>
            </div>
          </div>

          <!-- Фильтры -->
          <div class="mt-4 bg-white shadow rounded-lg p-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label class="form-label">Начальная дата</label>
                <input
                  type="date"
                  class="form-input"
                  [(ngModel)]="filter.startDate"
                  (change)="applyFilter()"
                >
              </div>
              <div>
                <label class="form-label">Конечная дата</label>
                <input
                  type="date"
                  class="form-input"
                  [(ngModel)]="filter.endDate"
                  (change)="applyFilter()"
                >
              </div>
              <div>
                <label class="form-label">Действие</label>
                <select
                  class="form-input"
                  [(ngModel)]="filter.action"
                  (change)="applyFilter()"
                >
                  <option value="">Все действия</option>
                  <option value="LOGIN">Вход в систему</option>
                  <option value="LOGOUT">Выход из системы</option>
                  <option value="CREATE">Создание</option>
                  <option value="UPDATE">Обновление</option>
                  <option value="DELETE">Удаление</option>
                  <option value="VALIDATE">Проверка документа</option>
                </select>
              </div>
              <div>
                <label class="form-label">Тип сущности</label>
                <select
                  class="form-input"
                  [(ngModel)]="filter.entityType"
                  (change)="applyFilter()"
                >
                  <option value="">Все типы</option>
                  <option value="USER">Пользователь</option>
                  <option value="DOCUMENT">Документ</option>
                  <option value="DIRECTORY">Директория</option>
                  <option value="SYSTEM">Система</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Таблица логов -->
          <div class="mt-8 flex flex-col">
            <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table class="min-w-full divide-y divide-gray-300">
                    <thead class="bg-gray-50">
                      <tr>
                        <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Время</th>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Действие</th>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Тип сущности</th>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">ID сущности</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 bg-white">
                      @for (log of filteredLogs; track log.id) {
                        <tr class="hover:bg-gray-50">
                          <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900">
                            {{ log.timestamp | date:'dd.MM.yyyy HH:mm:ss' }}
                          </td>
                          <td class="whitespace-nowrap px-3 py-4 text-sm">
                            <span [class]="getActionClass(log.action)">
                              {{ getActionText(log.action) }}
                            </span>
                          </td>
                          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {{ getEntityTypeText(log.entity_type) }}
                          </td>
                          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {{ log.entity_id }}
                          </td>
                        </tr>
                      } @empty {
                        <tr>
                          <td colspan="4" class="px-3 py-4 text-sm text-center text-gray-500">
                            Нет записей
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
  `
})
export class AuditComponent implements OnInit {
  userId: string | null = null;
  username: string | null = null;
  logs: AuditLogDTO[] = [];
  filteredLogs: AuditLogDTO[] = [];
  
  filter: AuditLogFilter = {};

  constructor(private route: ActivatedRoute) {
    this.userId = this.route.snapshot.paramMap.get('id');
    
    // Mock data
    const now = new Date();
    this.username = 'Павел Макаров';
    this.logs = [
      {
        id: BigInt(1),
        user_id: BigInt(this.userId || 1),
        action: 'LOGIN',
        entity_type: 'USER',
        entity_id: BigInt(1),
        timestamp: new Date(now.getTime() - 1000 * 60 * 5).toISOString() // 5 minutes ago
      },
      {
        id: BigInt(2),
        user_id: BigInt(this.userId || 1),
        action: 'CREATE',
        entity_type: 'DOCUMENT',
        entity_id: BigInt(3),
        timestamp: new Date(now.getTime() - 1000 * 60 * 10).toISOString() // 10 minutes ago
      },
      {
        id: BigInt(3),
        user_id: BigInt(this.userId || 1),
        action: 'VALIDATE',
        entity_type: 'DOCUMENT',
        entity_id: BigInt(3),
        timestamp: new Date(now.getTime() - 1000 * 60 * 15).toISOString() // 15 minutes ago
      },
      {
        id: BigInt(4),
        user_id: BigInt(this.userId || 1),
        action: 'UPDATE',
        entity_type: 'USER',
        entity_id: BigInt(this.userId || 1),
        timestamp: new Date(now.getTime() - 1000 * 60 * 30).toISOString() // 30 minutes ago
      },
      {
        id: BigInt(5),
        user_id: BigInt(this.userId || 1),
        action: 'CREATE',
        entity_type: 'DIRECTORY',
        entity_id: BigInt(3),
        timestamp: new Date(now.getTime() - 1000 * 60 * 45).toISOString() // 45 minutes ago
      }
    ];
    this.filteredLogs = [...this.logs];
  }

  ngOnInit(): void {
    // In a real app, we would fetch the logs from an API
  }

  applyFilter(): void {
    this.filteredLogs = this.logs.filter(log => {
      if (this.filter.startDate && new Date(log.timestamp) < new Date(this.filter.startDate)) {
        return false;
      }
      if (this.filter.endDate && new Date(log.timestamp) > new Date(this.filter.endDate)) {
        return false;
      }
      if (this.filter.action && log.action !== this.filter.action) {
        return false;
      }
      if (this.filter.entityType && log.entity_type !== this.filter.entityType) {
        return false;
      }
      return true;
    });
  }

  getActionClass(action: string): string {
    switch (action) {
      case 'LOGIN':
        return 'px-2 py-1 text-xs font-medium rounded-full bg-success-100 text-success-800';
      case 'LOGOUT':
        return 'px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800';
      case 'CREATE':
        return 'px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800';
      case 'UPDATE':
        return 'px-2 py-1 text-xs font-medium rounded-full bg-warning-100 text-warning-800';
      case 'DELETE':
        return 'px-2 py-1 text-xs font-medium rounded-full bg-error-100 text-error-800';
      case 'VALIDATE':
        return 'px-2 py-1 text-xs font-medium rounded-full bg-secondary-100 text-secondary-800';
      default:
        return 'px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800';
    }
  }

  getActionText(action: string): string {
    switch (action) {
      case 'LOGIN':
        return 'Вход';
      case 'LOGOUT':
        return 'Выход';
      case 'CREATE':
        return 'Создание';
      case 'UPDATE':
        return 'Обновление';
      case 'DELETE':
        return 'Удаление';
      case 'VALIDATE':
        return 'Проверка';
      default:
        return action;
    }
  }

  getEntityTypeText(type: string): string {
    switch (type) {
      case 'USER':
        return 'Пользователь';
      case 'DOCUMENT':
        return 'Документ';
      case 'DIRECTORY':
        return 'Директория';
      case 'SYSTEM':
        return 'Система';
      default:
        return type;
    }
  }
}