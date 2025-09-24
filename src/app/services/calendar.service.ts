// src/app/services/calendar.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ICalendarEvent } from '../interface/calendarEventent.interface';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private apiUrl = `${environment.apiUrl}/calendar`;

  constructor(private http: HttpClient) {}

  getEvents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/events`, {});
  }

  createEvent(event: Partial<ICalendarEvent>): Observable<ICalendarEvent> {
    return this.http.post<ICalendarEvent>(`${this.apiUrl}/create`, event);
  }

  // ======================================
  // UPDATE - atualizar evento
  // ======================================
  updateEvent(
    eventId: string,
    event: Partial<ICalendarEvent>
  ): Observable<ICalendarEvent> {
    return this.http.put<ICalendarEvent>(
      `${this.apiUrl}/update/${eventId}`,
      event
    );
  }

  // ======================================
  // DELETE - deletar evento
  // ======================================
  deleteEvent(eventId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${eventId}`);
  }
}
