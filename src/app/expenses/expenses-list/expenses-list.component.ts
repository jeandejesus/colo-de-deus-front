// src/app/expenses/expenses-list/expenses-list.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpensesService } from '../../expenses.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-expenses-list',
  standalone: true,
  imports: [CommonModule, FormsModule], // ⬅️ Adicione o FormsModule aqui
  templateUrl: './expenses-list.component.html',
  styleUrl: './expenses-list.component.scss',
})
export class ExpensesListComponent implements OnInit {
  expenses: any[] = [];
  filteredExpenses: any[] = []; // ⬅️ Nova lista para os resultados filtrados
  startDate: string = ''; // ⬅️ Propriedade para a data de início
  endDate: string = ''; // ⬅️ Propriedade para a data de fim

  constructor(
    private expensesService: ExpensesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.expensesService.findAll().subscribe({
      next: (data) => {
        this.expenses = data;
        this.filteredExpenses = data; // ⬅️ Inicialmente, exibe todos os itens
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

  onFilter(): void {
    const start = this.startDate ? new Date(this.startDate) : null;
    const end = this.endDate ? new Date(this.endDate) : null;

    this.filteredExpenses = this.expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      const isAfterStart = start ? expenseDate >= start : true;
      const isBeforeEnd = end ? expenseDate <= end : true;

      return isAfterStart && isBeforeEnd;
    });
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
