import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { ValidationSettingsDTO, ValidationResponseDTO } from '../models/validation.model';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  private readonly API_URL = 'http://localhost:8083/api';

  constructor(private http: HttpClient) {}

  validateDocument(file: File, settings: ValidationSettingsDTO): Observable<ValidationResponseDTO> {
    // Мок ответа от сервера
    const mockResponse: ValidationResponseDTO = {
      success: true,
      message: 'Статистика по проверке:',
      data: {
        totalChecks: 215,
        passedChecks: 193,
        failedChecks: 22,
        durationMs: 3624,
        commentsCount: 14,
        fixCount: 0
      }
    };

    // Имитация задержки сервера
    return of(mockResponse).pipe(delay(2000));

    // Реальный API запрос будет выглядеть так:
    // const formData = new FormData();
    // formData.append('file', file);
    // formData.append('settings', JSON.stringify(settings));
    // return this.http.post<ValidationResponseDTO>(`${this.API_URL}/validate`, formData);
  }
}