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

  async requestSubscription(userId: string, token: string) {
    console.log('Iniciando requestSubscription para userId:', userId);
    console.log('Service Worker habilitado:', this.swPush.isEnabled);
    console.log('Chave VAPID:', this.VAPID_PUBLIC_KEY);
    console.log('URL do backend:', `${this.apiUrl}/subscribe`);

    if (this.swPush.isEnabled) {
      try {
        const subscription = await this.swPush.requestSubscription({
          serverPublicKey: this.VAPID_PUBLIC_KEY,
        });
        console.log('Subscrição obtida:', subscription);

        const payload = { userId, subscription };
        console.log('Enviando requisição para o backend:', payload);
        this.http
          .post(`${this.apiUrl}/subscribe`, payload, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .subscribe({
            next: () => console.log('Inscrição enviada com sucesso!'),
            error: (error) =>
              console.error('Erro ao enviar inscrição:', error.message, error),
          });
      } catch (err) {
        console.error('Erro ao obter subscrição:', err);
      }
    } else {
      console.error('Service Worker não está habilitado');
    }
  }

  requestUnsubscription(subscription: any, token: string) {
    this.http
      .post(
        `${this.apiUrl}/unsubscribe`,
        {
          subscription,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .subscribe(
        () => console.log('Inscrição removida com sucesso!'),
        (error) => console.error('Erro ao enviar inscrição:', error)
      );
  }

  getNotificationStatus(token: string, endpoint: string): Observable<any> {
    // ✅ Retorne o tipo 'any' ou a estrutura de dados que seu backend envia
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // ✅ Retorne o Observable diretamente, sem se inscrever nele aqui
    return this.http.get(
      `${this.apiUrl}/get-status-notification/${encodeURIComponent(endpoint)}`,
      {
        headers,
      }
    );
  }
}
