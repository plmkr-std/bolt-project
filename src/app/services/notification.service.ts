import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { NotificationDTO } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly API_URL = 'http://localhost:8082/api/notifications';

  // Временные данные для примера
  private mockNotifications: NotificationDTO[] = [
     {
      id: '0',
      message: 'Работа была успешно проверена',
      recipientId: 1,
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 5 минут назад
      entity: {
        id: '123',
        type: 'WORK'
      }
    },
    {
      id: '1',
      message: 'Email был изменен',
      recipientId: 1,
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 5 минут назад
      entity: {
        id: '123',
        type: 'WORK'
      }
    },
    {
      id: '2',
      message: 'Пароль был изменен',
      recipientId: 1,
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 час назад
      entity: {
        id: '123',
        type: 'COMMENT'
      }
    },
    {
      id: '3',
      message: 'Вы вошли в аккаунт',
      recipientId: 1,
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 день назад
      entity: {
        id: '456',
        type: 'SYSTEM'
      }
    },
    {
      id: '4',
      message: 'Аккаунт был создан',
      recipientId: 1,
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 день назад
      entity: {
        id: '456',
        type: 'SYSTEM'
      }
  ];

  constructor(private http: HttpClient) {}

  getCurrentUserNotifications(): Observable<NotificationDTO[]> {
    // В реальном приложении использовать API
    // return this.http.get<NotificationDTO[]>(`${this.API_URL}/recipient/current`);
    return of(this.mockNotifications);
  }

  markAsRead(id: string): Observable<NotificationDTO> {
    // В реальном приложении использовать API
    // return this.http.put<NotificationDTO>(`${this.API_URL}/${id}`, {});
    const notification = this.mockNotifications.find(n => n.id === id);
    if (notification) {
      notification.isRead = true;
    }
    return of(notification!);
  }

  markSelectedAsRead(ids: string[]): Observable<void> {
    // В реальном приложении использовать API
    // return this.http.put<void>(`${this.API_URL}/selected`, ids);
    this.mockNotifications.forEach(n => {
      if (ids.includes(n.id)) {
        n.isRead = true;
      }
    });
    return of(void 0);
  }

  markAllAsRead(): Observable<void> {
    // В реальном приложении использовать API
    // return this.http.put<void>(`${this.API_URL}/recipient/current`, {});
    this.mockNotifications.forEach(n => n.isRead = true);
    return of(void 0);
  }

  deleteNotification(id: string): Observable<void> {
    // В реальном приложении использовать API
    // return this.http.delete<void>(`${this.API_URL}/${id}`);
    this.mockNotifications = this.mockNotifications.filter(n => n.id !== id);
    return of(void 0);
  }

  deleteSelected(ids: string[]): Observable<void> {
    // В реальном приложении использовать API
    // return this.http.delete<void>(`${this.API_URL}/selected`, { body: ids });
    this.mockNotifications = this.mockNotifications.filter(n => !ids.includes(n.id));
    return of(void 0);
  }

  deleteAll(): Observable<void> {
    // В реальном приложении использовать API
    // return this.http.delete<void>(`${this.API_URL}/recipient/current`);
    this.mockNotifications = [];
    return of(void 0);
  }
}