// src/app/auth/reset-password/reset-password.component.ts

import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PasswordResetService } from '../request-reset.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class ResetPasswordComponent implements OnInit {
  requestForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private passwordResetService: PasswordResetService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.requestForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.requestForm.valid) {
      this.errorMessage = null;

      this.passwordResetService
        .requestReset(this.requestForm.value.email)
        .subscribe(
          (response) => {
            // A resposta do back-end sempre será sucesso para não revelar e-mails de usuários.
            this.snackBar.open(
              'Se o e-mail estiver cadastrado, um link de redefinição foi enviado. Verifique sua caixa de entrada.',
              'Fechar',
              { duration: 7000 }
            );
            this.router.navigate(['/login']);
          },
          (error) => {
            this.errorMessage = error.error.messages;
            this.snackBar.open(
              'Se o e-mail estiver cadastrado, um link de redefinição foi enviado. Verifique sua caixa de entrada.',
              'Fechar',
              { duration: 7000 }
            );
            console.error('Erro ao enviar a solicitação:', error);
          }
        );
    } else {
      this.errorMessage = 'Por favor, insira um e-mail válido.';
    }
  }
}
