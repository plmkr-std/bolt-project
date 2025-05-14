import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { ValidationSettingsDTO, ValidationResponseDTO } from '../models/validation.model';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  private readonly API_URL = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  validateDocument(file: File, settings: ValidationSettingsDTO): Observable<ValidationResponseDTO> {
    // Мок ответа от сервера
    const mockResponse: ValidationResponseDTO = {
      success: true,
      message: 'Документ успешно проверен',
      details: {
        wordCount: 1500,
        plagiarismPercentage: 15,
        grammarErrors: 5,
        formattingErrors: 2
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