import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { NotificationDTO, NotificationFilter } from '../../models/notification.model';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative">
      <!-- Кнопка с бейджем -->
      <button
        (click)="toggleDropdown()"
        class="nav-icon-link relative"
        [class.text-primary-600]="isOpen"
        title="Уведомления"
      >
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        @if (unreadCount > 0) {
          <span class="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {{ unreadCount }}
          </span>
        }
      </button>

      <!-- Выпадающий список -->
      @if (isOpen) {
        <div
          class="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg overflow-hidden z-50"
          (clickOutside)="closeDropdown()"
        >
          <!-- Заголовок -->
          <div class="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">Уведомления</h3>
            <div class="flex space-x-2">
              <button
                class="text-sm text-error-600 hover:text-error-800"
                [disabled]="!selectedNotifications.length && !notifications.length"
                (click)="confirmDeleteSelected()"
              >
                {{ selectedNotifications.length ? 'Удалить выбранные' : 'Удалить все' }}
              </button>
              <button
                class="text-sm text-gray-600 hover:text-primary-600"
                (click)="markAllAsRead()"
                [disabled]="!hasUnread"
              >
                {{ selectedNotifications.length ? 'Прочитать выбранные' : 'Прочитать все' }}
              </button>
            </div>
          </div>

          <!-- Фильтры -->
          <div class="px-4 py-2 border-b border-gray-200 flex space-x-4">
            <button
              *ngFor="let f of ['all', 'unread', 'read']"
              (click)="setFilter(f)"
              class="text-sm"
              [class.text-primary-600]="currentFilter === f"
              [class.text-gray-600]="currentFilter !== f"
            >
              {{ f === 'all' ? 'Все' : f === 'unread' ? 'Непрочитанные' : 'Прочитанные' }}
            </button>
          </div>

          <!-- Список уведомлений -->
          <div class="max-h-96 overflow-y-auto">
            @if (filteredNotifications.length) {
              @for (notification of filteredNotifications; track notification.id) {
                <div
                  class="px-4 py-3 hover:bg-gray-50 flex items-start justify-between transition-colors duration-200"
                  [class.bg-gray-50]="notification.isRead"
                >
                  <div class="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      class="mt-1 h-4 w-4 rounded border-gray-300"
                      [checked]="isSelected(notification.id)"
                      (change)="toggleSelection(notification.id)"
                    >
                    <div>
                      <p class="text-sm text-gray-900" [class.font-medium]="!notification.isRead">
                        {{ notification.message }}
                      </p>
                      <p class="text-xs text-gray-500 mt-1">
                        {{ notification.createdAt | date:'dd.MM.yyyy HH:mm' }}
                      </p>
                    </div>
                  </div>
                  <div class="ml-4 flex space-x-2">
                    @if (!notification.isRead) {
                      <button
                        class="text-sm text-primary-600 hover:text-primary-800"
                        (click)="markAsRead(notification.id)"
                      >
                        Прочитать
                      </button>
                    }
                    <button
                      class="text-sm text-error-600 hover:text-error-800"
                      (click)="deleteNotification(notification.id)"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              }
            } @else {
              <div class="px-4 py-6 text-center text-gray-500">
                Нет уведомлений
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class NotificationsComponent implements OnInit {
  notifications: NotificationDTO[] = [];
  selectedNotifications: string[] = [];
  isOpen = false;
  currentFilter: NotificationFilter = 'all';

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('app-notifications')) {
      this.isOpen = false;
    }
  }

  get filteredNotifications(): NotificationDTO[] {
    switch (this.currentFilter) {
      case 'read':
        return this.notifications.filter(n => n.isRead);
      case 'unread':
        return this.notifications.filter(n => !n.isRead);
      default:
        return this.notifications;
    }
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  get hasUnread(): boolean {
    return this.unreadCount > 0;
  }

  isSelected(id: string): boolean {
    return this.selectedNotifications.includes(id);
  }

  toggleSelection(id: string): void {
    const index = this.selectedNotifications.indexOf(id);
    if (index === -1) {
      this.selectedNotifications.push(id);
    } else {
      this.selectedNotifications.splice(index, 1);
    }
  }

  confirmDeleteSelected(): void {
    if (this.selectedNotifications.length) {
      this.deleteSelected(this.selectedNotifications);
    } else {
      this.deleteAll();
    }
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  closeDropdown(): void {
    this.isOpen = false;
  }

  setFilter(filter: string): void {
    this.currentFilter = filter as NotificationFilter;
  }

  loadNotifications(): void {
    this.notificationService.getCurrentUserNotifications()
      .subscribe(notifications => {
        this.notifications = notifications;
        this.selectedNotifications = [];
      });
  }

  markAsRead(id: string): void {
    this.notificationService.markAsRead(id)
      .subscribe(() => {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
          notification.isRead = true;
        }
      });
  }

  markAllAsRead(): void {
    if (this.selectedNotifications.length) {
      this.notificationService.markSelectedAsRead(this.selectedNotifications)
        .subscribe(() => {
          this.notifications.forEach(n => {
            if (this.selectedNotifications.includes(n.id)) {
              n.isRead = true;
            }
          });
        });
    } else {
      this.notificationService.markAllAsRead()
        .subscribe(() => {
          this.notifications.forEach(n => n.isRead = true);
        });
    }
  }

  deleteNotification(id: string): void {
    this.notificationService.deleteNotification(id)
      .subscribe(() => {
        this.notifications = this.notifications.filter(n => n.id !== id);
        this.selectedNotifications = this.selectedNotifications.filter(selectedId => selectedId !== id);
      });
  }

  deleteSelected(ids: string[]): void {
    this.notificationService.deleteSelected(ids)
      .subscribe(() => {
        this.notifications = this.notifications.filter(n => !ids.includes(n.id));
        this.selectedNotifications = [];
      });
  }

  deleteAll(): void {
    this.notificationService.deleteAll()
      .subscribe(() => {
        this.notifications = [];
        this.selectedNotifications = [];
      });
  }
}