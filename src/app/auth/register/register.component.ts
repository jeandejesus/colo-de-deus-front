// src/app/auth/register/register.component.ts

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
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select'; // Adicione este import
import { MatFormFieldModule } from '@angular/material/form-field'; // Adicione este import

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule, // Adicione à lista de imports
    MatFormFieldModule,
  ],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  vocationalYears: string[] = [
    'ano 1',
    'ano 2',
    'discipulado',
    'apostolado',
    'consagrado',
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      birthDate: ['', Validators.required],
      phone: ['', Validators.required],
      address: this.fb.group({
        street: ['', Validators.required],
        neighborhood: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
      }),
      vocationalYear: ['', Validators.required],
      monthlyContributionDay: [10, [Validators.min(1), Validators.max(31)]],
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      console.log('Dados do formulário:', this.registerForm.value);
      this.authService.register(this.registerForm.value).subscribe(
        (response) => {
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          console.error('Erro no cadastro:', error);
          // TODO: Exibir uma mensagem de erro na tela
        }
      );
    }
  }
}
