// src/app/expenses/expense-form/expense-form.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ExpensesService } from '../../services/expenses.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './expense-form.component.html',
  styleUrl: './expense-form.component.scss',
})
export class ExpenseFormComponent implements OnInit {
  expenseForm!: FormGroup;
  isEditing = false;
  itemId: string | null = null;
  categories: any[] = []; // ⬅️ Nova propriedade para categorias

  constructor(
    private fb: FormBuilder,
    private expensesService: ExpensesService,
    private router: Router,
    private route: ActivatedRoute, // Injete ActivatedRoute
    private categoriesService: CategoriesService // ⬅️ Injete o serviço de categorias
  ) {}

  ngOnInit(): void {
    this.expenseForm = this.fb.group({
      description: ['', Validators.required],
      value: ['', [Validators.required, Validators.min(0.01)]],
      date: ['', Validators.required],
      category: ['', Validators.required], // ⬅️ Adicionado o novo campo de categoria
    });

    this.loadCategories(); // ⬅️ Chama o método para carregar as categorias

    // Verifica se há um ID na URL para saber se é edição
    this.itemId = this.route.snapshot.paramMap.get('id');
    if (this.itemId) {
      this.isEditing = true;
      this.expensesService.findOne(this.itemId).subscribe({
        next: (data) => {
          // Preenche o formulário com os dados do item
          this.expenseForm.patchValue({
            description: data.description,
            value: data.value,
            date: new Date(data.date).toISOString().split('T')[0],
            category: data.category?._id, // ⬅️ Popula o campo com o ID da categoria
          });
        },
        error: (err) => {
          console.error('Erro ao carregar despesa:', err);
        },
      });
    }
  }

  // ⬅️ Novo método para carregar categorias de despesa
  loadCategories(): void {
    this.categoriesService.findAllByType('expense').subscribe({
      next: (data) => (this.categories = data),
      error: (err) => console.error('Erro ao carregar categorias:', err),
    });
  }

  onSubmit(): void {
    if (this.expenseForm.valid) {
      if (this.isEditing && this.itemId) {
        this.expensesService
          .update(this.itemId, this.expenseForm.value)
          .subscribe({
            next: () => {
              console.log('Despesa atualizada com sucesso!');
              this.router.navigate(['/expenses']);
            },
            error: (err) => {
              console.error('Erro ao atualizar despesa:', err);
            },
          });
      } else {
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
}
