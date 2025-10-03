import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface EventModel {
  _id?: string;
  title: string;
  description: string;
  startDate: string; // antes era date
  endDate: string; // nova propriedade
  location: string;
}

export interface Registration {
  _id?: string;
  eventId: string;
  userId: string;
  checkedIn: boolean;
  qrCode?: string;
}

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/events`;

  // ---------- EVENTOS ----------
  getEvents(): Observable<EventModel[]> {
    return this.http.get<EventModel[]>(this.apiUrl);
  }

  getEventById(id: string): Observable<EventModel> {
    return this.http.get<EventModel>(`${this.apiUrl}/${id}`);
  }

  createEvent(event: EventModel): Observable<EventModel> {
    return this.http.post<EventModel>(this.apiUrl, event);
  }

  updateEvent(id: string, event: EventModel): Observable<EventModel> {
    return this.http.put<EventModel>(`${this.apiUrl}/${id}`, event);
  }

  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // ---------- INSCRIÇÕES ----------
  registerToEvent(eventId: string, userId: string): Observable<Registration> {
    return this.http.post<Registration>(
      `${this.apiUrl}/${eventId}/subscribe/${userId}`,
      {
        userId,
      }
    );
  }

  getRegistrations(eventId: string): Observable<Registration[]> {
    return this.http.get<Registration[]>(
      `${this.apiUrl}/${eventId}/registrations`
    );
  }

  checkIn(eventId: string, userId: string): Observable<Registration> {
    return this.http.post<Registration>(`${this.apiUrl}/${eventId}/checkin`, {
      userId,
    });
  }

  getUserEventQRCode(eventId: string, userId: string) {
    return this.http.get<{ qrCode: string; eventTitle: string }>(
      `${this.apiUrl}/${eventId}/registration/${userId}`
    );
  }

  getUserRegistrations(userId: string) {
    return this.http.get<{ eventId: string; qrCode: string }[]>(
      `${this.apiUrl}/users/${userId}/registrations`
    );
  }
}
