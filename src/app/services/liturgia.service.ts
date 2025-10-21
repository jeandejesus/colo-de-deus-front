import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Liturgia {
  date: string;
  primeira_leitura: string;
  salmo: string;
  segunda_leitura: string;
  evangelho: string;
  reflexao: string;
}

@Injectable({
  providedIn: 'root',
})
export class LiturgiaService {
  private apiUrl = `${environment.apiUrl}/liturgia`;

  constructor(private http: HttpClient) {}

  getToday(): Observable<Liturgia> {
    return this.http.get<Liturgia>(`${this.apiUrl}/today`);
  }

  getByDate(date: string): Observable<Liturgia> {
    return this.http.get<Liturgia>(`${this.apiUrl}/${date}`);
  }
}
