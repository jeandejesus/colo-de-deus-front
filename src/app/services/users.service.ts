// O código ideal se você estiver usando o HttpInterceptor
// src/app/core/services/user.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  updateUserRole(userId: string, newRole: string): Observable<any> {
    const body = { role: newRole };
    return this.http.patch(`${this.apiUrl}/${userId}/role`, body);
  }

  getUserById(userId: string): Observable<any> {
    const url = `${this.apiUrl}/${userId}`;
    return this.http.get<any>(url);
  }

  updateUser(updatedUser: any): Observable<any> {
    const url = `${this.apiUrl}/me`;
    return this.http.patch(url, updatedUser);
  }
}
