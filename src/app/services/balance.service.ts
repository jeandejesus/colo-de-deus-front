// src/app/balance.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BalanceService {
  private apiUrl = `${environment.apiUrl}/balance`;

  constructor(private http: HttpClient) {}

  getBalance(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  setBalance(value: number): Observable<any> {
    return this.http.patch<any>(this.apiUrl, { value });
  }
}
