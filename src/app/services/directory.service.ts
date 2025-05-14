import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { DocumentDirectoryDTO } from '../models/directory.model';

@Injectable({
  providedIn: 'root'
})
export class DirectoryService {
  private readonly API_URL = 'http://localhost:8080/api/directories';

  // Mock data for development
  private mockDirectories: DocumentDirectoryDTO[] = [
    {
      id: '1',
      name: 'Публикация Макаров',
      creationTime: '2025-05-14T10:31:22',
      changeTime: '2025-05-14T22:45:12',
      totalSizeBytes: 15728640, // 15MB
      documentsCount: 5
    },
    {
      id: '2',
      name: 'test',
      creationTime: '2025-04-10T09:15:23',
      changeTime: '2025-04-19T14:20:00',
      totalSizeBytes: 31457280, // 30MB
      documentsCount: 8
    },
    {
      id: '3',
      name: 'example',
      creationTime: '2025-04-01T11:00:19',
      changeTime: '2025-04-18T16:31:56',
      totalSizeBytes: 5242880, // 5MB
      documentsCount: 3
    },
    {
      id: '4',
      name: 'НИР',
      creationTime: '2025-05-15T09:30:00',
      changeTime: '2025-05-15T15:45:33',
      totalSizeBytes: 52428800, // 50MB
      documentsCount: 12
    },
    {
      id: '5',
      name: 'ВКР',
      creationTime: '2025-05-14T16:20:15',
      changeTime: '2025-05-15T11:30:45',
      totalSizeBytes: 83886080, // 80MB
      documentsCount: 15
    },
    {
      id: '6',
      name: 'Стили',
      creationTime: '2025-05-13T14:15:30',
      changeTime: '2025-05-15T10:25:18',
      totalSizeBytes: 104857600, // 100MB
      documentsCount: 25
    },
    {
      id: '7',
      name: 'Тесть',
      creationTime: '2025-05-15T08:45:12',
      changeTime: '2025-05-15T14:20:33',
      totalSizeBytes: 20971520, // 20MB
      documentsCount: 7
    }
  ];

  constructor(private http: HttpClient) {}

  getAllDirectories(): Observable<DocumentDirectoryDTO[]> {
    // In a real application, use:
    // return this.http.get<DocumentDirectoryDTO[]>(this.API_URL);
    return of(this.mockDirectories);
  }

  deleteDirectory(id: string): Observable<void> {
    // In a real application, use:
    // return this.http.delete<void>(`${this.API_URL}/${id}`);
    this.mockDirectories = this.mockDirectories.filter(dir => dir.id !== id);
    return of(void 0);
  }

  deleteSelectedDirectories(ids: string[]): Observable<void> {
    // In a real application, use:
    // return this.http.delete<void>(`${this.API_URL}/batch`, { body: ids });
    this.mockDirectories = this.mockDirectories.filter(dir => !ids.includes(dir.id));
    return of(void 0);
  }

  deleteAllDirectories(): Observable<void> {
    // In a real application, use:
    // return this.http.delete<void>(`${this.API_URL}/all`);
    this.mockDirectories = [];
    return of(void 0);
  }
}