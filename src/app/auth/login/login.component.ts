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
          const subscription =
            await this.notificationsService.getExistingSubscription();

          if (this.swPush.isEnabled && !subscription) {
            const permission = await Notification.requestPermission();

            if (permission === 'granted') {
              await this.notificationsService.requestSubscription(
                user.id,
                access_token
              );
              this.router.navigate(['/dashboard']);
            } else {
              this.errorMessage =
                'Você precisa permitir notificações para receber alertas.';
            }
          } else {
            this.router.navigate(['/dashboard']);
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
