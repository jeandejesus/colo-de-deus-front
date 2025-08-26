// src/app/notifications/notifications.service.ts

import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  // Substitua pela sua chave pública VAPID gerada no NestJS
  readonly VAPID_PUBLIC_KEY =
    'BODD-W0-GH3GOhbgqjNhPBSLQW6q5YohLi3Wq7dTCgyevsp5uQwri8SW9p0vt0ccL2WNpzimJ3oGX6JnrRWqoUM';

  constructor(private swPush: SwPush, private http: HttpClient) {}

  requestSubscription(userId: string, token: string) {
    if (this.swPush.isEnabled) {
      this.swPush
        .requestSubscription({
          serverPublicKey: this.VAPID_PUBLIC_KEY,
        })
        .then((subscription) => {
          console.log('Inscrição do PWA gerada:', subscription);

          // Envia a inscrição para o back-end
          this.http
            .post(
              'http://localhost:3000/notifications/subscribe',
              { userId, subscription },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
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
