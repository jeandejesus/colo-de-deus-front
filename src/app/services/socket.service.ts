// src/app/services/socket.service.ts
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private apiUrl = `${environment.apiUrl}`;

  private socket!: Socket;

  connect() {
    this.socket = io(this.apiUrl);
  }

  joinEvent(eventId: string) {
    this.socket.emit('joinEvent', eventId);
  }

  onParticipantsUpdate(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('participantsUpdate', (data) => observer.next(data));
    });
  }
}
