import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OptionalUserInfoDTO, UserInfoDTO, ChangeEmailRequestDTO } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = 'http://localhost:8080/api/accounts';

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<UserInfoDTO> {
    return this.http.get<UserInfoDTO>(`${this.API_URL}/current`);
  }

  getAllUsers(): Observable<UserInfoDTO[]> {
    return this.http.get<UserInfoDTO[]>(`${this.API_URL}`);
  }

  getUserById(id: number): Observable<UserInfoDTO> {
    return this.http.get<UserInfoDTO>(`${this.API_URL}/${id}`);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  updateOptionalInfo(info: OptionalUserInfoDTO): Observable<UserInfoDTO> {
    return this.http.put<UserInfoDTO>(`${this.API_URL}/current/optional-info`, info);
  }

  requestEmailChange(data: ChangeEmailRequestDTO): Observable<any> {
    return this.http.post(`${this.API_URL}/current/email`, data);
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.patch(`${this.API_URL}/current/password`, {
      token: currentPassword,
      password: newPassword
    });
  }
}