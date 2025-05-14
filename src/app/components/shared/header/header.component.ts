import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, ConfirmModalComponent],
  template: `
    <header class="bg-white shadow">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <a routerLink="/dashboard" class="text-xl font-semibold text-gray-900 hover:text-primary-600 transition-colors duration-200">
                Система проверки работ
              </a>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <a routerLink="/users" class="nav-icon-link" title="Пользователи">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </a>
            <a routerLink="/storage" class="nav-icon-link" title="Хранилище">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </a>
            <a routerLink="/profile" class="nav-icon-link" title="Профиль">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </a>
            <a routerLink="/notifications" class="nav-icon-link" title="Уведомления">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </a>
            <button (click)="showLogoutConfirm = true" class="nav-icon-link" title="Выход">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </header>

    @if (showLogoutConfirm) {
      <app-confirm-modal
        title="Выход из системы"
        message="Вы действительно хотите выйти из системы?"
        confirmText="Выйти"
        cancelText="Отмена"
        (confirm)="confirmLogout()"
        (cancel)="showLogoutConfirm = false"
      />
    }
  `,
  styles: [`
    .nav-icon-link {
      @apply p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors duration-200;
    }
  `]
})
export class HeaderComponent {
  showLogoutConfirm = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  confirmLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}