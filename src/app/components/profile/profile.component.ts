import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { UserInfoDTO } from '../../models/user.model';
import { ErrorMessageComponent } from '../shared/error-message/error-message.component';
import { ChangePasswordModalComponent } from './change-password-modal/change-password-modal.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ErrorMessageComponent, ChangePasswordModalComponent],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-900">Профиль пользователя</h1>
            <div class="flex space-x-3">
              <button
                class="btn btn-secondary"
                (click)="showChangePasswordModal = true"
              >
                Изменить пароль
              </button>
              <button
                class="btn btn-primary"
                (click)="onSubmit()"
                [disabled]="isLoading || !profileForm.valid"
              >
                {{ isLoading ? 'Сохранение...' : 'Сохранить изменения' }}
              </button>
            </div>
          </div>

          @if (errorMessage) {
            <div class="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-md mb-4">
              {{ errorMessage }}
            </div>
          }

          @if (successMessage) {
            <div class="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-md mb-4">
              {{ successMessage }}
            </div>
          }

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Основная информация -->
            <div class="space-y-4">
              <div>
                <label class="form-label">Логин</label>
                <p class="text-gray-700">{{ userInfo?.username }}</p>
              </div>

              <div>
                <label class="form-label">Email</label>
                <div class="flex items-center space-x-2">
                  <p class="text-gray-700">{{ userInfo?.email }}</p>
                  <button
                    class="text-primary-600 hover:text-primary-700 text-sm"
                    (click)="showEmailChangeForm = !showEmailChangeForm"
                  >
                    Изменить
                  </button>
                </div>

                @if (showEmailChangeForm) {
                  <div class="mt-2">
                    <form [formGroup]="emailForm" (ngSubmit)="onEmailChange()">
                      <div class="flex space-x-2">
                        <input
                          type="email"
                          formControlName="email"
                          class="form-input"
                          placeholder="Новый email"
                        />
                        <button
                          type="submit"
                          class="btn btn-primary"
                          [disabled]="emailForm.invalid || isEmailChangeLoading"
                        >
                          {{ isEmailChangeLoading ? 'Отправка...' : 'Отправить' }}
                        </button>
                      </div>
                      <app-error-message [control]="emailForm.get('email')" />
                    </form>
                  </div>
                }
              </div>

              <div>
                <label class="form-label">Роли</label>
                <div class="flex flex-wrap gap-2">
                  @for (role of userInfo?.roles; track role.id) {
                    <span class="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                      {{ role.name.replace('ROLE_', '') }}
                    </span>
                  }
                </div>
              </div>
            </div>

            <!-- Форма редактирования -->
            <form [formGroup]="profileForm">
              <div class="space-y-4">
                <div>
                  <label for="firstName" class="form-label">Имя</label>
                  <input
                    id="firstName"
                    type="text"
                    class="form-input"
                    formControlName="firstName"
                    placeholder="Введите имя"
                  />
                  <app-error-message [control]="profileForm.get('firstName')" />
                </div>

                <div>
                  <label for="lastName" class="form-label">Фамилия</label>
                  <input
                    id="lastName"
                    type="text"
                    class="form-input"
                    formControlName="lastName"
                    placeholder="Введите фамилию"
                  />
                  <app-error-message [control]="profileForm.get('lastName')" />
                </div>

                <div>
                  <label for="dateOfBirth" class="form-label">Дата рождения</label>
                  <input
                    id="dateOfBirth"
                    type="date"
                    class="form-input"
                    formControlName="dateOfBirth"
                  />
                  <app-error-message [control]="profileForm.get('dateOfBirth')" />
                </div>

                <div>
                  <label for="gender" class="form-label">Пол</label>
                  <select
                    id="gender"
                    class="form-input"
                    formControlName="gender"
                  >
                    <option value="">Выберите пол</option>
                    <option value="MALE">Мужской</option>
                    <option value="FEMALE">Женский</option>
                  </select>
                  <app-error-message [control]="profileForm.get('gender')" />
                </div>
              </div>
            </form>
          </div>

          <div class="mt-6 pt-6 border-t border-gray-200">
            <div class="flex justify-between text-sm text-gray-500">
              <p>Дата регистрации: {{ userInfo?.createdAt | date:'dd.MM.yyyy HH:mm' }}</p>
              <p>Последнее обновление: {{ userInfo?.updatedAt | date:'dd.MM.yyyy HH:mm' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    @if (showChangePasswordModal) {
      <app-change-password-modal
        (close)="showChangePasswordModal = false"
      />
    }
  `
})
export class ProfileComponent implements OnInit {
  userInfo: UserInfoDTO | null = null;
  profileForm: FormGroup;
  emailForm: FormGroup;
  
  isLoading = false;
  isEmailChangeLoading = false;
  showEmailChangeForm = false;
  showChangePasswordModal = false;
  
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.profileForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      dateOfBirth: [''],
      gender: ['']
    });

    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    // Пример данных пользователя
    this.userInfo = {
      id: 1,
      username: 'john_doe',
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      gender: 'MALE',
      createdAt: '2024-01-01T10:00:00',
      updatedAt: '2024-03-15T15:30:00',
      roles: [
        { id: 1, name: 'ROLE_USER' },
        { id: 2, name: 'ROLE_ADMIN' }
      ]
    };

    // Заполняем форму данными пользователя
    this.profileForm.patchValue({
      firstName: this.userInfo.firstName,
      lastName: this.userInfo.lastName,
      dateOfBirth: this.userInfo.dateOfBirth,
      gender: this.userInfo.gender
    });
  }

  ngOnInit(): void {
    this.loadUserInfo();
  }

  loadUserInfo(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.userInfo = user;
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender
        });
      },
      error: (error) => {
        this.errorMessage = error.message || 'Ошибка при загрузке данных пользователя';
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = null;
      this.successMessage = null;

      this.userService.updateOptionalInfo(this.profileForm.value).subscribe({
        next: (user) => {
          this.userInfo = user;
          this.successMessage = 'Профиль успешно обновлен';
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = error.message || 'Ошибка при обновлении профиля';
          this.isLoading = false;
        }
      });
    }
  }

  onEmailChange(): void {
    if (this.emailForm.valid && !this.isEmailChangeLoading) {
      this.isEmailChangeLoading = true;
      this.errorMessage = null;
      this.successMessage = null;

      this.userService.requestEmailChange(this.emailForm.value).subscribe({
        next: () => {
          this.successMessage = 'На указанный email отправлено письмо для подтверждения';
          this.isEmailChangeLoading = false;
          this.showEmailChangeForm = false;
          this.emailForm.reset();
        },
        error: (error) => {
          this.errorMessage = error.message || 'Ошибка при смене email';
          this.isEmailChangeLoading = false;
        }
      });
    }
  }
}