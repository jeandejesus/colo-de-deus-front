// src/app/auth/reset-password/reset-password.component.ts

import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PasswordResetService } from '../request-reset.service';

@Component({
  selector: 'app-request-reset',
  templateUrl: './request-reset.component.html', // ✅ Change this line
  styleUrls: ['./request-reset.component.scss'], // ✅ and this line
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class RequestResetComponent implements OnInit {
  resetForm!: FormGroup;
  token: string | null = null;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private passwordResetService: PasswordResetService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // ✅ 1. Obter o token da URL
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
      if (!this.token) {
        // Se não houver token, o link é inválido. Redireciona.
        this.snackBar.open('Link de redefinição inválido.', 'Fechar', {
          duration: 5000,
        });
        this.router.navigate(['/login']);
      }
    });

    // ✅ 2. Criar o formulário com validações
    this.resetForm = this.fb.group({
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/
          ),
        ],
      ],
      confirmPassword: ['', this.passwordsMatchValidator],
    });
  }

  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      return { passwordsNotMatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (
      this.resetForm.valid &&
      this.resetForm.value.password === this.resetForm.value.confirmPassword
    ) {
      if (!this.token) {
        // Não deve acontecer se a verificação acima estiver correta, mas é uma segurança extra.
        return;
      }

      // ✅ 3. Chamar o serviço para redefinir a senha
      this.passwordResetService
        .resetPassword(this.token, this.resetForm.value.password)
        .subscribe(
          (response) => {
            // ✅ 4. Sucesso: exibir mensagem e redirecionar
            this.snackBar.open('Senha redefinida com sucesso!', 'Fechar', {
              duration: 5000,
            });
            this.router.navigate(['/login']);
          },
          (error) => {
            // ✅ 5. Erro: exibir mensagem do back-end
            this.errorMessage =
              error.error?.message || 'Erro ao redefinir a senha.';
            this.snackBar.open(this.errorMessage, 'Fechar', { duration: 5000 });
            console.error('Erro ao redefinir a senha:', error);
          }
        );
    } else {
      this.errorMessage = 'As senhas não coincidem ou o formulário é inválido.';
    }
  }
}
