// O código ideal se você estiver usando o HttpInterceptor
// src/app/core/services/user.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user';

export interface PagedResult<T> {
  data: T[];
  total: number;
}
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

  getUsersPaginate(page = 1, limit = 10): Observable<PagedResult<User>> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('limit', String(limit));

    return this.http.get<PagedResult<User>>(`${this.apiUrl}/paginate`, {
      params,
    });
  }

  deleteUser(id: string) {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
