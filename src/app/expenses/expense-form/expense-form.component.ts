// src/app/expenses/expense-form/expense-form.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ExpensesService } from '../../expenses.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './expense-form.component.html',
  styleUrl: './expense-form.component.scss',
})
export class ExpenseFormComponent implements OnInit {
  expenseForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private expensesService: ExpensesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.expenseForm = this.fb.group({
      description: ['', Validators.required],
      value: ['', [Validators.required, Validators.min(0.01)]],
      date: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.expenseForm.valid) {
      this.expensesService.create(this.expenseForm.value).subscribe({
        next: () => {
          console.log('Despesa adicionada com sucesso!');
          this.router.navigate(['/expenses']);
        },
        error: (err) => {
          console.error('Erro ao adicionar despesa:', err);
        },
      });
    }
  }
}
