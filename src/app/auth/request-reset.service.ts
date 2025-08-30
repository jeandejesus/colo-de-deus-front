// src/app/services/password-reset.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PasswordResetService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  /**
   * Envia uma requisição para solicitar um link de redefinição de senha.
   * @param email O e-mail do usuário que solicitou a redefinição.
   * @returns Um Observable com a resposta da API.
   */
  requestReset(email: string): Observable<any> {
    const body = { email: email };
    return this.http.post(`${this.apiUrl}/request`, body);
  }

  /**
   * Envia a requisição para redefinir a senha do usuário.
   * @param token O token de redefinição obtido da URL.
   * @param newPassword A nova senha do usuário.
   * @returns Um Observable com a resposta da API.
   */
  resetPassword(token: string, newPassword: string): Observable<any> {
    const body = {
      token: token,
      password: newPassword,
    };
    return this.http.post(`${this.apiUrl}/reset`, body);
  }
}
