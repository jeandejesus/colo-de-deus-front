// src/app/services/incomes.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IncomesService {
  private apiUrl = 'http://localhost:3000/incomes';

  constructor(private http: HttpClient) {}

  findAll(startDate?: string, endDate?: string): Observable<any[]> {
    let params = new HttpParams().set('populate', 'category');

    if (startDate) {
      params = params.set('startDate', startDate);
    }
    if (endDate) {
      params = params.set('endDate', endDate);
    }

    return this.http.get<any[]>(this.apiUrl, { params });
  }

  findOne(id: string): Observable<any> {
    const params = new HttpParams().set('populate', 'category');
    return this.http.get<any>(`${this.apiUrl}/${id}`, { params });
  }

  create(income: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, income);
  }

  update(id: string, income: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, income);
  }

  remove(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
