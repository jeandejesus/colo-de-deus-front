// src/app/incomes/incomes.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class IncomesService {
  private apiUrl = 'http://localhost:3000/incomes';

  constructor(private http: HttpClient, private authService: AuthService) {} // Injete o AuthService

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  create(incomeData: any): Observable<any> {
    return this.http.post(this.apiUrl, incomeData, {
      headers: this.getAuthHeaders(),
    });
  }

  findAll(): Observable<any> {
    return this.http.get(this.apiUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  update(id: string, incomeData: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, incomeData, {
      headers: this.getAuthHeaders(),
    });
  }

  remove(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  findOne(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
