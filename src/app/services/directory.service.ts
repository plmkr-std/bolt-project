import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { DocumentDirectoryDTO, DirectoryTag } from '../models/directory.model';

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
      documentsCount: 5,
      tags: ['важное', 'публикация']
    },
    {
      id: '2',
      name: 'test',
      creationTime: '2025-04-10T09:15:23',
      changeTime: '2025-04-19T14:20:00',
      totalSizeBytes: 31457280, // 30MB
      documentsCount: 8,
      tags: ['тест']
    },
    {
      id: '3',
      name: 'example',
      creationTime: '2025-04-01T11:00:19',
      changeTime: '2025-04-18T16:31:56',
      totalSizeBytes: 5242880, // 5MB
      documentsCount: 3,
      tags: []
    },
    {
      id: '4',
      name: 'НИР',
      creationTime: '2025-05-15T09:30:00',
      changeTime: '2025-05-15T15:45:33',
      totalSizeBytes: 52428800, // 50MB
      documentsCount: 12,
      tags: ['важное', 'нир']
    },
    {
      id: '5',
      name: 'ВКР',
      creationTime: '2025-05-14T16:20:15',
      changeTime: '2025-05-15T11:30:45',
      totalSizeBytes: 83886080, // 80MB
      documentsCount: 15,
      tags: ['важное', 'вкр']
    },
    {
      id: '6',
      name: 'Стили',
      creationTime: '2025-05-13T14:15:30',
      changeTime: '2025-05-15T10:25:18',
      totalSizeBytes: 104857600, // 100MB
      documentsCount: 25,
      tags: ['стили']
    },
    {
      id: '7',
      name: 'Тесть',
      creationTime: '2025-05-15T08:45:12',
      changeTime: '2025-05-15T14:20:33',
      totalSizeBytes: 20971520, // 20MB
      documentsCount: 7,
      tags: []
    }
  ];

  private mockTags: DirectoryTag[] = [
    { id: '1', name: 'важное', color: '#EF4444' },
    { id: '2', name: 'публикация', color: '#3B82F6' },
    { id: '3', name: 'тест', color: '#10B981' },
    { id: '4', name: 'нир', color: '#F59E0B' },
    { id: '5', name: 'вкр', color: '#8B5CF6' },
    { id: '6', name: 'стили', color: '#EC4899' }
  ];

  constructor(private http: HttpClient) {}

  getAllDirectories(): Observable<DocumentDirectoryDTO[]> {
    return of(this.mockDirectories);
  }

  getAllTags(): Observable<DirectoryTag[]> {
    return of(this.mockTags);
  }

  createTag(name: string): Observable<DirectoryTag> {
    const colors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
    const newTag: DirectoryTag = {
      id: Math.random().toString(36).substring(7),
      name,
      color: colors[Math.floor(Math.random() * colors.length)]
    };
    this.mockTags.push(newTag);
    return of(newTag);
  }

  updateDirectoryTags(directoryId: string, tags: string[]): Observable<void> {
    const directory = this.mockDirectories.find(d => d.id === directoryId);
    if (directory) {
      directory.tags = tags;
    }
    return of(void 0);
  }

  deleteDirectory(id: string): Observable<void> {
    this.mockDirectories = this.mockDirectories.filter(dir => dir.id !== id);
    return of(void 0);
  }

  deleteSelectedDirectories(ids: string[]): Observable<void> {
    this.mockDirectories = this.mockDirectories.filter(dir => !ids.includes(dir.id));
    return of(void 0);
  }

  deleteAllDirectories(): Observable<void> {
    this.mockDirectories = [];
    return of(void 0);
  }
}