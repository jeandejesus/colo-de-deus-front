// src/app/expenses/expenses-list/expenses-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { ExpensesService } from '../../services/expenses.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { PermissionDirective } from '../../directives/permission.directive';
import { MatIconModule } from '@angular/material/icon';
import { DayOfWeekPipe } from '../../pipes/day-of-week.pipe';
import { LoadingScreenComponent } from '../../shared/loading-screen/loading-screen.component';

@Component({
  selector: 'app-expenses-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    DateFormatPipe,
    PermissionDirective,
    DayOfWeekPipe,
    KeyValuePipe,
    MatIconModule,
    LoadingScreenComponent,
  ],
  templateUrl: './expenses-list.component.html',
  styleUrls: ['./expenses-list.component.scss'], // ✅ corrigido
})
export class ExpensesListComponent implements OnInit {
  startDate: string = '';
  endDate: string = '';
  groupedExpenses: Record<string, any[]> = {};
  isLoading: boolean = true;

  months = [
    { value: 0, name: 'Janeiro' },
    { value: 1, name: 'Fevereiro' },
    { value: 2, name: 'Março' },
    { value: 3, name: 'Abril' },
    { value: 4, name: 'Maio' },
    { value: 5, name: 'Junho' },
    { value: 6, name: 'Julho' },
    { value: 7, name: 'Agosto' },
    { value: 8, name: 'Setembro' },
    { value: 9, name: 'Outubro' },
    { value: 10, name: 'Novembro' },
    { value: 11, name: 'Dezembro' },
  ];

  selectedMonth: number = new Date().getMonth();

  constructor(
    private expensesService: ExpensesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses(): void {
    this.isLoading = true;
    const today = new Date();
    const year = today.getFullYear();

    // Calcula a data de início do mês
    const startDate = new Date(year, this.selectedMonth, 1).toISOString();

    // Calcula a data de fim do mês
    const endDate = new Date(
      year,
      this.selectedMonth + 1,
      0,
      23,
      59,
      59,
      999
    ).toISOString();

    this.expensesService.findAll(startDate, endDate).subscribe({
      next: (data) => {
        this.groupedExpenses = this.groupTransactionsByDate(data);
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;

        console.error('Erro ao buscar receitas:', err);
      },
    });
  }

  onMonthChange(): void {
    this.loadExpenses();
  }

  previousMonth(): void {
    // Se for o primeiro mês, volta para o último do ano
    if (this.selectedMonth === 0) {
      this.selectedMonth = 11;
    } else {
      this.selectedMonth--;
    }
    this.loadExpenses();
  }

  // ✅ Método para avançar um mês
  nextMonth(): void {
    // Se for o último mês, avança para o primeiro do próximo ano
    if (this.selectedMonth === 11) {
      this.selectedMonth = 0;
    } else {
      this.selectedMonth++;
    }
    this.loadExpenses();
  }

  private groupTransactionsByDate(expensess: any[]): Record<string, any[]> {
    const groupedData: Record<string, any[]> = {};

    expensess.forEach((expenses) => {
      // Formate a data para usar como chave
      const date = new Date(expenses.date);
      const formattedDate = date.toLocaleDateString('pt-BR');

      if (!groupedData[formattedDate]) {
        groupedData[formattedDate] = [];
      }
      groupedData[formattedDate].push(expenses);
    });
    return groupedData;
  }

  onFilter(): void {
    this.loadExpenses();
  }

  goToAddExpense(): void {
    this.router.navigate(['/expenses/add']);
  }

  onDeleteIncome(id: string): void {
    if (confirm('Tem certeza que deseja deletar esta receita?')) {
      this.expensesService.remove(id).subscribe({
        next: () => {
          this.loadExpenses();
        },
        error: (err) => {
          console.error('Erro ao deletar receita:', err);
        },
      });
    }
  }

  onEditIncome(id: string): void {
    this.router.navigate(['/expenses/edit', id]);
  }

  dateOrder(a: any, b: any) {
    const dateA = new Date(a.key.split('/').reverse().join('-'));
    const dateB = new Date(b.key.split('/').reverse().join('-'));
    return dateB.getTime() - dateA.getTime();
  }
}
