// src/app/services/payments.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentsService {
  constructor(private http: HttpClient) {}

  getUsersWithPaymentStatus(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/users/payments-status`);
  }

  // ✅ Método para registrar um pagamento
  markAsPaid(userId: string, amount: number): Observable<any> {
    const body = {
      userId,
      amount,
    };
    return this.http.post(`${environment.apiUrl}/users/payment`, body);
  }
}
