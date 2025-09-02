import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { UserService } from '../../services/users.service'; // Make sure this is the correct path
import { format } from 'date-fns';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    NgxMaskDirective,
  ],
  providers: [provideNgxMask()],
})
export class PerfilComponent implements OnInit {
  registerForm!: FormGroup;
  userId: string | null = null; // Changed to allow null

  vocationalYears: string[] = [
    'ano 1',
    'ano 2',
    'discipulado',
    'apostolado',
    'consagrado',
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize the form first
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        null,
        [
          Validators.pattern(
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/
          ),
        ],
      ],
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
      trainer: ['', Validators.required],
    });

    // ✅ Get the user ID from localStorage
    this.userId = localStorage.getItem('user_id');

    if (this.userId) {
      // ✅ Fetch the user data from the backend
      this.userService.getUserById(this.userId).subscribe({
        next: (userData) => {
          // ✅ Pre-fill the form with the fetched data
          // We use patchValue to avoid errors if some fields are missing
          if (userData.birthDate) {
            const date = new Date(userData.birthDate);
            const year = date.getUTCFullYear();
            const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
            const day = date.getUTCDate().toString().padStart(2, '0');
            userData.birthDate = `${day}/${month}/${year}`; // dd/MM/yyyy
          }
          this.registerForm.patchValue(userData);

          // We also need to get the user's full address to fill the form
          this.registerForm.get('address')?.patchValue(userData.address);

          // The password field should not be pre-filled for security
          this.registerForm.get('password')?.patchValue('');

          console.log('Dados do usuário carregados:', userData);
        },
        error: (err) => {
          console.error('Erro ao buscar dados do usuário:', err);
          // TODO: Redirect or show an error message
        },
      });
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid && this.userId) {
      const formData = { ...this.registerForm.value };

      // Se a senha estiver vazia, remove o campo para não enviar ao backend
      if (!formData.password) {
        delete formData.password;
      }

      if (formData.birthDate) {
        let birth = formData.birthDate;

        if (birth.includes('/')) {
          const [day, month, year] = birth.split('/');
          formData.birthDate = `${year}-${month.padStart(
            2,
            '0'
          )}-${day.padStart(2, '0')}`;
        } else if (birth.length === 8) {
          // ddMMyyyy -> yyyy-MM-dd
          const day = birth.slice(0, 2);
          const month = birth.slice(2, 4);
          const year = birth.slice(4, 8);
          formData.birthDate = `${year}-${month}-${day}`;
        } else {
          console.warn('Formato de birthDate inválido:', birth);
          delete formData.birthDate;
        }
      }

      this.userService.updateUser(formData).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Erro no cadastro:', error);
          // TODO: Exibir uma mensagem de erro na tela
        },
      });
    }
  }
}
