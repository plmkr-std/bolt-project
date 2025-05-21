import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserInfoDTO } from '../../models/user.model';
import { HeaderComponent } from '../shared/header/header.component';
import { ConfirmModalComponent } from '../shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, HeaderComponent, ConfirmModalComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-header />
      
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 sm:px-0">
          <div class="sm:flex sm:items-center">
            <div class="sm:flex-auto">
              <h1 class="text-2xl font-semibold text-gray-900">Пользователи</h1>
              <p class="mt-2 text-sm text-gray-700">
                Список всех пользователей системы
              </p>
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
                        <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">ID</th>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Логин</th>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Роли</th>
                        <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span class="sr-only">Действия</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 bg-white">
                      @for (user of users; track user.id) {
                        <tr>
                          <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {{ user.id }}
                          </td>
                          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ user.username }}</td>
                          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ user.email }}</td>
                          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div class="flex flex-wrap gap-2">
                              @for (role of user.roles; track role.id) {
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  {{ role.name.replace('ROLE_', '') }}
                                </span>
                              }
                            </div>
                          </td>
                          <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <div class="flex justify-end space-x-2">
                              <button
                                class="text-primary-600 hover:text-primary-900"
                                (click)="viewProfile(user.id)"
                              >
                                Просмотр
                              </button>
                              <button
                                class="text-primary-600 hover:text-primary-900"
                                (click)="viewAudit(user.id)"
                              >
                                История
                              </button>
                              <button
                                class="text-error-600 hover:text-error-900"
                                (click)="confirmDelete(user)"
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

    @if (userToDelete) {
      <app-confirm-modal
        title="Удаление пользователя"
        [message]="'Вы действительно хотите удалить пользователя ' + userToDelete.username + '?'"
        confirmText="Удалить"
        cancelText="Отмена"
        (confirm)="deleteUser()"
        (cancel)="userToDelete = null"
      />
    }
  `
})
export class UsersComponent implements OnInit {
  users: UserInfoDTO[] = [
    {
      id: 1,
      username: 'plmkr',
      email: 'pmakarovstudy@gmail.com',
      firstName: 'Павел',
      lastName: 'Макаров',
      dateOfBirth: '2002-01-29',
      gender: 'MALE',
      createdAt: '2025-05-01T11:29:55',
      updatedAt: '2024-05-12T15:30:04',
      roles: [
        { id: 1, name: 'ROLE_USER' },
        { id: 2, name: 'ROLE_ADMIN' }
      ]
    },
    {
      id: 2,
      username: 'admin',
      email: 'admin@example.com',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-05-15',
      gender: 'MALE',
      createdAt: '2025-04-10T09:15:30',
      updatedAt: '2025-05-11T14:20:15',
      roles: [
        { id: 2, name: 'ROLE_ADMIN' }
      ]
    },
    {
      id: 3,
      username: 'user',
      email: 'user@example.com',
      firstName: 'Alice',
      lastName: 'Smith',
      dateOfBirth: '1995-08-22',
      gender: 'FEMALE',
      createdAt: '2025-03-20T16:40:00',
      updatedAt: '2025-05-10T11:05:45',
      roles: [
        { id: 1, name: 'ROLE_USER' }
      ]
    },
    {
      id: 4,
      username: 'guest',
      email: 'guest@example.com',
      firstName: 'Robert',
      lastName: 'Wilson',
      dateOfBirth: '1988-11-30',
      gender: 'MALE',
      createdAt: '2025-02-15T13:25:10',
      updatedAt: '2025-05-09T09:30:20',
      roles: [
        { id: 1, name: 'ROLE_USER' }
      ]
    }
  ];
  errorMessage: string | null = null;
  successMessage: string | null = null;
  userToDelete: UserInfoDTO | null = null;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // In a real application, this would fetch users from the server
    // this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Ошибка при загрузке списка пользователей';
      }
    });
  }

  viewProfile(userId: number): void {
    this.router.navigate(['/profile', userId]);
  }

  viewAudit(userId: number): void {
    this.router.navigate(['/users', userId, 'audit']);
  }

  confirmDelete(user: UserInfoDTO): void {
    this.userToDelete = user;
  }

  deleteUser(): void {
    if (!this.userToDelete) return;

    // In a real application, this would delete the user from the server
    this.users = this.users.filter(user => user.id !== this.userToDelete?.id);
    this.successMessage = `Пользователь ${this.userToDelete?.username} успешно удален`;
    this.userToDelete = null;
    
    setTimeout(() => {
      this.successMessage = null;
    }, 3000);

    // Real API call would look like this:
    // this.userService.deleteUser(this.userToDelete.id).subscribe({
    //   next: () => {
    //     this.successMessage = `Пользователь ${this.userToDelete?.username} успешно удален`;
    //     this.users = this.users.filter(user => user.id !== this.userToDelete?.id);
    //     this.userToDelete = null;
    //     
    //     setTimeout(() => {
    //       this.successMessage = null;
    //     }, 3000);
    //   },
    //   error: (error) => {
    //     this.errorMessage = error.message || 'Ошибка при удалении пользователя';
    //     this.userToDelete = null;
    //   }
    // });
  }
}