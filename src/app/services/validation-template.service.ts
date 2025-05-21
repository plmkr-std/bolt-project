import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ValidationTemplateDTO, CreateTemplateDTO } from '../models/validation-template.model';

@Injectable({
  providedIn: 'root'
})
export class ValidationTemplateService {
  private readonly API_URL = 'http://localhost:8083/api/validation-templates';

  // Mock data
  private mockTemplates: ValidationTemplateDTO[] = [
    {
      _id: '1',
      userId: 1,
      name: 'Новый шаблон',
      createdAt: new Date().toISOString(),
      settings: {
        sectionSettings: {
          pageTemplate: 'A4',
          fieldTemplate: 'standard'
        },
        paragraphSettings: {
          firstLine: 1.25,
          lineSpacing: 1.5,
          intervalBeforeSpacing: 0,
          intervalAfterSpacing: 0
        },
        textSettings: {
          fontStyle: 'Times New Roman',
          leftBorderSize: 12,
          rightBorderSize: 14
        },
        autofix: true
      }
    },
    {
      _id: '2',
      userId: 1,
      name: 'Класный шаблон',
      createdAt: new Date().toISOString(),
      settings: {
        sectionSettings: {
          pageTemplate: 'A4',
          fieldTemplate: 'narrow'
        },
        paragraphSettings: {
          firstLine: 1.25,
          lineSpacing: 1.15,
          intervalBeforeSpacing: 6,
          intervalAfterSpacing: 6
        },
        textSettings: {
          fontStyle: 'Arial',
          leftBorderSize: 11,
          rightBorderSize: 12
        },
        autofix: false
      }
    }
  ];

  constructor(private http: HttpClient) {}

  getTemplates(): Observable<ValidationTemplateDTO[]> {
    // In a real app: return this.http.get<ValidationTemplateDTO[]>(this.API_URL);
    return of(this.mockTemplates);
  }

  createTemplate(template: CreateTemplateDTO): Observable<ValidationTemplateDTO> {
    // In a real app: return this.http.post<ValidationTemplateDTO>(this.API_URL, template);
    const newTemplate: ValidationTemplateDTO = {
      _id: Math.random().toString(36).substr(2, 9),
      userId: 1,
      name: template.name,
      createdAt: new Date().toISOString(),
      settings: template.settings
    };
    this.mockTemplates.push(newTemplate);
    return of(newTemplate);
  }

  deleteTemplate(id: string): Observable<void> {
    // In a real app: return this.http.delete<void>(`${this.API_URL}/${id}`);
    this.mockTemplates = this.mockTemplates.filter(t => t._id !== id);
    return of(void 0);
  }
}