// src/app/expenses/expenses-list/expenses-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpensesService } from '../../services/expenses.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-expenses-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './expenses-list.component.html',
  styleUrls: ['./expenses-list.component.scss'], // ✅ corrigido
})
export class ExpensesListComponent implements OnInit {
  expenses: any[] = [];
  startDate: string = '';
  endDate: string = '';

  constructor(
    private expensesService: ExpensesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses(): void {
    this.expensesService.findAll(this.startDate, this.endDate).subscribe({
      next: (data) => {
        this.expenses = [...data]; // ✅ força atualização no Angular
      },
      error: (err) => {
        console.error('Erro ao buscar despesas:', err);
      },
    });
  }

  onFilter(): void {
    this.loadExpenses();
  }

  goToAddExpense(): void {
    this.router.navigate(['/expenses/add']);
  }

  onDeleteExpense(id: string): void {
    if (confirm('Tem certeza que deseja deletar esta despesa?')) {
      this.expensesService.remove(id).subscribe({
        next: () => {
          console.log('Despesa deletada com sucesso!');
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
