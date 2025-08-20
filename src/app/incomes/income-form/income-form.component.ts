// src/app/incomes/income-form/income-form.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { IncomesService } from '../../incomes.service';
import { ActivatedRoute, Router } from '@angular/router'; // Importe ActivatedRoute

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

  constructor(
    private fb: FormBuilder,
    private incomesService: IncomesService,
    private router: Router,
    private route: ActivatedRoute // Injete ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.incomeForm = this.fb.group({
      description: ['', Validators.required],
      value: ['', [Validators.required, Validators.min(0.01)]],
      date: ['', Validators.required],
    });

    // Verifica se há um ID na URL para saber se é edição
    this.itemId = this.route.snapshot.paramMap.get('id');
    if (this.itemId) {
      this.isEditing = true;
      this.incomesService.findOne(this.itemId).subscribe({
        next: (data) => {
          // Preenche o formulário com os dados do item
          this.incomeForm.patchValue({
            description: data.description,
            value: data.value,
            date: new Date(data.date).toISOString().split('T')[0], // Formato YYYY-MM-DD
          });
        },
        error: (err) => {
          console.error('Erro ao carregar receita:', err);
        },
      });
    }
  }

  onSubmit(): void {
    if (this.incomeForm.valid) {
      if (this.isEditing && this.itemId) {
        this.incomesService
          .update(this.itemId, this.incomeForm.value)
          .subscribe({
            next: () => {
              console.log('Receita atualizada com sucesso!');
              this.router.navigate(['/incomes']);
            },
            error: (err) => {
              console.error('Erro ao atualizar receita:', err);
            },
          });
      } else {
        this.incomesService.create(this.incomeForm.value).subscribe({
          next: () => {
            console.log('Receita adicionada com sucesso!');
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
