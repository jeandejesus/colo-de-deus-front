// src/app/notifications/notifications.service.ts

import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  apiUrl = `${environment.apiUrl}/notifications`;
  readonly VAPID_PUBLIC_KEY = environment.vapidPublicKey;

  constructor(private swPush: SwPush, private http: HttpClient) {}

  requestSubscription(userId: string, token: string) {
    if (this.swPush.isEnabled) {
      this.swPush
        .requestSubscription({
          serverPublicKey: this.VAPID_PUBLIC_KEY,
        })
        .then((subscription) => {
          this.http
            .post(
              `${this.apiUrl}/subscribe`,
              { userId, subscription },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            )
            .subscribe(
              () => console.log('Inscrição enviada com sucesso!'),
              (error) => console.error('Erro ao enviar inscrição:', error)
            );
        })
        .catch(console.error);
    }
  }

  requestUnsubscription(token: string) {
    this.http
      .post(`${this.apiUrl}/unsubscribe`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe(
        () => console.log('Inscrição enviada com sucesso!'),
        (error) => console.error('Erro ao enviar inscrição:', error)
      );
  }

  getNotificationStatus(token: string): Observable<any> {
    // ✅ Retorne o tipo 'any' ou a estrutura de dados que seu backend envia
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // ✅ Retorne o Observable diretamente, sem se inscrever nele aqui
    return this.http.get(`${this.apiUrl}/get-status-notification`, { headers });
  }
}
