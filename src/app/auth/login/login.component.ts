// src/app/auth/login/login.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Router, RouterLink } from '@angular/router';
import { NotificationsService } from '../../services/notifications.service';
import { SwPush } from '@angular/service-worker';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  // ✅ New property to hold the error message
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationsService: NotificationsService,
    private router: Router,
    private swPush: SwPush
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  async onSubmit(): Promise<void> {
    this.errorMessage = null;

    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        async (response) => {
          const { access_token, user } = response;

          // Navegue para o dashboard imediatamente.
          // A lógica de notificação pode rodar em paralelo.
          this.router.navigate(['/dashboard']);

          // 1. Verifique se o Service Worker está habilitado.
          if (this.swPush.isEnabled) {
            // 2. Aguarde que o Service Worker esteja pronto.
            // O service worker já deve estar registrado via app.config.ts.
            // O `requestPermission` pode ser chamado antes de `swPush.requestSubscription`.
            const permission = await Notification.requestPermission();

            if (permission === 'granted') {
              // 3. Chame a lógica de inscrição do seu serviço de notificações.
              // Essa função já tem a lógica de 'requestSubscription' dentro dela.
              this.notificationsService.requestSubscription(
                user.id,
                access_token
              );
            } else {
              this.errorMessage =
                'Você precisa permitir notificações para receber alertas.';
            }
          }
        },
        (error: HttpErrorResponse) => {
          this.errorMessage =
            error.error?.messages ||
            'Erro ao tentar fazer login. Tente novamente.';
        }
      );
    }
  }
}
