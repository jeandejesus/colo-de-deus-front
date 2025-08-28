// src/app/notifications/notifications.service.ts

import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  apiUrl = `${environment.apiUrl}/notifications/subscribe`;
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
              this.apiUrl,
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
}
