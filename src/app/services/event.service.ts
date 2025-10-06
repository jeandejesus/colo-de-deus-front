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

export interface RegistrationResponse {
  msg: string;
  qrCode: string;
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
  private apiUrl = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient) {}

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
  registerToEvent(eventId: string, userId: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/${eventId}/subscribe/${userId}`,
      {}
    );
  }

  getRegistrations(eventId: string): Observable<Registration[]> {
    return this.http.get<Registration[]>(
      `${this.apiUrl}/${eventId}/registrations`
    );
  }

  getParticipants(eventId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${eventId}/participants`);
  }

  checkIn(eventId: string, qrCode: string): Observable<Registration> {
    return this.http.post<Registration>(
      `${this.apiUrl}/${eventId}/checkin/${qrCode}`,
      {}
    );
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
