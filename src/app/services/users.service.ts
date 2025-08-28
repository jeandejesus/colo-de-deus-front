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
    // O interceptor adiciona o token automaticamente
    return this.http.patch(`${this.apiUrl}/${userId}/role`, body);
  }
}
