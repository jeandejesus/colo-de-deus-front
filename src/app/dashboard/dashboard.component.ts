// src/app/dashboard/dashboard.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { ExpensesService } from '../expenses.service';
import { IncomesService } from '../incomes.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  totalIncomes: number = 0;
  totalExpenses: number = 0;
  balance: number = 0;

  constructor(
    private incomesService: IncomesService,
    private expensesService: ExpensesService
  ) {}

  ngOnInit(): void {
    // Usa forkJoin para buscar receitas e despesas em paralelo
    forkJoin({
      incomes: this.incomesService.findAll(),
      expenses: this.expensesService.findAll(),
    }).subscribe({
      next: ({ incomes, expenses }) => {
        this.totalIncomes = this.calculateTotal(incomes);
        this.totalExpenses = this.calculateTotal(expenses);
        this.balance = this.totalIncomes - this.totalExpenses;
      },
      error: (err) => {
        console.error('Erro ao carregar o dashboard:', err);
      },
    });
  }

  private calculateTotal(items: any[]): number {
    return items.reduce((sum, item) => sum + item.value, 0);
  }
}
