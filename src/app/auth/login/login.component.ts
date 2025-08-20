// src/app/auth/login/login.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { NotificationsService } from '../../notifications.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationsService: NotificationsService // Injete o serviço
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        (response) => {
          console.log('Login bem-sucedido!', response);

          const { access_token } = response;
          // TODO: Salvar o token em um local seguro (e.g., localStorage)

          // Solicita a inscrição para notificações após o login
          this.notificationsService.requestSubscription(
            response._id,
            access_token
          );

          // TODO: Redirecionar o usuário para a página principal
        },
        (error) => {
          console.error('Erro no login:', error);
          // TODO: Exibir uma mensagem de erro para o usuário
        }
      );
    }
  }
}
