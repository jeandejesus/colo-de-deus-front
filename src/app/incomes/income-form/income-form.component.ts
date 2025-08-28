// src/app/incomes/income-form/income-form.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { IncomesService } from '../../services/incomes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-income-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './income-form.component.html',
  styleUrl: './income-form.component.scss',
})
export class IncomeFormComponent implements OnInit {
  incomeForm!: FormGroup;
  isEditing = false;
  itemId: string | null = null;
  categories: any[] = []; // Nova propriedade para categorias

  constructor(
    private fb: FormBuilder,
    private incomesService: IncomesService,
    private router: Router,
    private route: ActivatedRoute,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.incomeForm = this.fb.group({
      description: ['', Validators.required],
      value: ['', [Validators.required, Validators.min(0.01)]],
      date: ['', Validators.required],
      category: ['', Validators.required], // ⬅️ Adicionado o novo campo de categoria
    });

    this.loadCategories();

    this.itemId = this.route.snapshot.paramMap.get('id');
    if (this.itemId) {
      this.isEditing = true;
      this.incomesService.findOne(this.itemId).subscribe({
        next: (data) => {
          // Preenche o formulário com os dados do item
          this.incomeForm.patchValue({
            description: data.description,
            value: data.value,
            date: new Date(data.date).toISOString().split('T')[0],
            category: data.category?._id, // ⬅️ Popula o campo com o ID da categoria
          });
        },
        error: (err) => {
          console.error('Erro ao carregar receita:', err);
        },
      });
    }
  }

  loadCategories(): void {
    this.categoriesService.findAllByType('income').subscribe({
      next: (data) => (this.categories = data),
      error: (err) => console.error('Erro ao carregar categorias:', err),
    });
  }

  onSubmit(): void {
    if (this.incomeForm.valid) {
      if (this.isEditing && this.itemId) {
        this.incomesService
          .update(this.itemId, this.incomeForm.value)
          .subscribe({
            next: () => {
              this.router.navigate(['/incomes']);
            },
            error: (err) => {
              console.error('Erro ao atualizar receita:', err);
            },
          });
      } else {
        this.incomesService.create(this.incomeForm.value).subscribe({
          next: () => {
            this.router.navigate(['/incomes']);
          },
          error: (err) => {
            console.error('Erro ao adicionar receita:', err);
          },
        });
      }
    }
  }
}
