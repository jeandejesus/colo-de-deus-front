// src/app/auth/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';
interface JwtPayload {
  exp: number;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  private readonly TOKEN_KEY = 'authToken';
  private readonly USER_ROLE_KEY = 'userRole';

  constructor(private http: HttpClient) {}

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response.access_token) {
          // Salva o token
          this.saveToken(response.access_token);
          // ➡️ Salva o papel do usuário, que vem no objeto 'user'
          if (response.user && response.user.role) {
            this.saveUserRole(response.user.role);
          }
        }
      })
    );
  }

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Novo método para salvar o papel do usuário
  private saveUserRole(role: string): void {
    localStorage.setItem(this.USER_ROLE_KEY, role);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUserRole(): string | null {
    return localStorage.getItem(this.USER_ROLE_KEY);
  }

  getRoleFromToken(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY); // O nome da sua chave

    if (!token) {
      return null;
    }

    try {
      const decodedToken: any = jwtDecode(token);
      console.log(decodedToken);
      return decodedToken.role;
    } catch (error) {
      // Se o token for inválido, o jwtDecode lançará um erro
      console.error('Erro ao decodificar o token:', error);
      return null;
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    // ➡️ Limpa ambos os itens do localStorage
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_ROLE_KEY);
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const now = Date.now() / 1000; // segundos
      return decoded.exp < now;
    } catch {
      return true; // se der erro ao decodificar, considera expirado
    }
  }
}
