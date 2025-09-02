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
    private router: Router
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
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('user_id', user.id);

          let permission = await Notification.requestPermission();
          if (permission !== 'granted') {
            this.errorMessage =
              'Você precisa permitir notificações para receber alertas.';
          }

          if (permission === 'granted') {
            this.notificationsService.requestSubscription(
              user.id,
              access_token
            );
          }

          this.router.navigate(['/dashboard']);
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
