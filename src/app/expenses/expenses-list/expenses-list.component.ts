// src/app/expenses/expenses-list/expenses-list.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpensesService } from '../../expenses.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-expenses-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expenses-list.component.html',
  styleUrl: './expenses-list.component.scss',
})
export class ExpensesListComponent implements OnInit {
  expenses: any[] = [];

  constructor(
    private expensesService: ExpensesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.expensesService.findAll().subscribe({
      next: (data) => {
        this.expenses = data;
      },
      error: (err) => {
        console.error('Erro ao buscar despesas:', err);
      },
    });
    this.loadExpenses();
  }

  goToAddExpense(): void {
    this.router.navigate(['/expenses/add']);
  }

  // Novo método para carregar os dados
  private loadExpenses(): void {
    this.expensesService.findAll().subscribe({
      next: (data) => {
        this.expenses = data;
      },
      error: (err) => {
        console.error('Erro ao buscar despesas:', err);
      },
    });
  }

  // Novo método para deletar uma despesa
  onDeleteExpense(id: string): void {
    if (confirm('Tem certeza que deseja deletar esta despesa?')) {
      this.expensesService.remove(id).subscribe({
        next: () => {
          console.log('Despesa deletada com sucesso!');
          // Recarrega a lista para refletir a mudança
          this.loadExpenses();
        },
        error: (err) => {
          console.error('Erro ao deletar despesa:', err);
        },
      });
    }
  }

  onEditExpense(id: string): void {
    this.router.navigate(['/expenses/edit', id]);
  }
}
