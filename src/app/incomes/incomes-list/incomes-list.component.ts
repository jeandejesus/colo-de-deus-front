// src/app/incomes/incomes-list/incomes-list.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncomesService } from '../../incomes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-incomes-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './incomes-list.component.html',
  styleUrl: './incomes-list.component.scss',
})
export class IncomesListComponent implements OnInit {
  incomes: any[] = [];

  constructor(private incomesService: IncomesService, private router: Router) {}

  ngOnInit(): void {
    this.incomesService.findAll().subscribe({
      next: (data) => {
        this.incomes = data;
      },
      error: (err) => {
        console.error('Erro ao buscar receitas:', err);
      },
    });
  }

  // Redireciona para o formulário de adição
  goToAddIncome(): void {
    this.router.navigate(['/incomes/add']);
  }

  onDeleteIncome(id: string): void {
    if (confirm('Tem certeza que deseja deletar esta receita?')) {
      this.incomesService.remove(id).subscribe({
        next: () => {
          console.log('Receita deletada com sucesso!');
          // Recarrega a lista para refletir a mudança
          this.loadIncomes();
        },
        error: (err) => {
          console.error('Erro ao deletar receita:', err);
        },
      });
    }
  }

  private loadIncomes(): void {
    this.incomesService.findAll().subscribe({
      next: (data) => {
        this.incomes = data;
      },
      error: (err) => {
        console.error('Erro ao buscar receitas:', err);
      },
    });
  }

  onEditIncome(id: string): void {
    this.router.navigate(['/incomes/edit', id]);
  }
}
