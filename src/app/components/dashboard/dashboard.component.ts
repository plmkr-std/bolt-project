import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../shared/header/header.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-header />
      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <div class="rounded-lg h-96 flex items-center justify-center bg-white shadow">
            <div class="text-center">
              <h2 class="text-2xl font-bold text-gray-800 mb-2">Добро пожаловать в систему</h2>
              <p class="text-gray-600">Выберите нужный раздел в верхнем меню</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  `
})
export class DashboardComponent {}