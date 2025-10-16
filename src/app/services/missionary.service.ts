import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Missionary {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  address: {
    street: string;
    neighborhood?: string;
    city: string;
    state: string;
    location?: {
      type: 'Point';
      coordinates: [number, number]; // [lon, lat]
    };
  };
  // campo calculado (frontend)
  distance?: number;
}

@Injectable({ providedIn: 'root' })
export class MissionaryService {
  private baseUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  // Busca todos com location
  getAllWithLocation(): Observable<Missionary[]> {
    return this.http.get<Missionary[]>(`${this.baseUrl}/users/with-location`);
  }

  // Busca missionários próximos ao endereço (opcional, caso exista endpoint)
  findNearbyByAddress(address: string, limit = 10) {
    return this.http.get<any>(`${this.baseUrl}/users/location/near`, {
      params: { address, limit: `${limit}` },
    });
  }

  updateCoordinates(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.baseUrl}/geo/update`,
      {}
    );
  }
}
