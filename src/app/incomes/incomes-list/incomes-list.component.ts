// src/app/incomes/incomes-list/incomes-list.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { IncomesService } from '../../services/incomes.service';
import { Router, RouterModule } from '@angular/router'; // ⬅️ Adicionado RouterModule
import { FormsModule } from '@angular/forms';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { PermissionDirective } from '../../directives/permission.directive';
import { DayOfWeekPipe } from '../../pipes/day-of-week.pipe';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-incomes-list',
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
  ], // ⬅️ Adicionado RouterModule
  templateUrl: './incomes-list.component.html',
  styleUrl: './incomes-list.component.scss',
})
export class IncomesListComponent implements OnInit {
  startDate: string = '';
  endDate: string = '';
  groupedIncomes: Record<string, any[]> = {};
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

  constructor(private incomesService: IncomesService, private router: Router) {}

  ngOnInit(): void {
    this.loadIncomes();
  }

  loadIncomes(): void {
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

    this.incomesService.findAll(startDate, endDate).subscribe({
      next: (data) => {
        this.groupedIncomes = this.groupTransactionsByDate(data);
      },
      error: (err) => {
        console.error('Erro ao buscar receitas:', err);
      },
    });
  }

  onMonthChange(): void {
    this.loadIncomes();
  }

  previousMonth(): void {
    // Se for o primeiro mês, volta para o último do ano
    if (this.selectedMonth === 0) {
      this.selectedMonth = 11;
    } else {
      this.selectedMonth--;
    }
    this.loadIncomes();
  }

  // ✅ Método para avançar um mês
  nextMonth(): void {
    // Se for o último mês, avança para o primeiro do próximo ano
    if (this.selectedMonth === 11) {
      this.selectedMonth = 0;
    } else {
      this.selectedMonth++;
    }
    this.loadIncomes();
  }

  private groupTransactionsByDate(incomes: any[]): Record<string, any[]> {
    const groupedData: Record<string, any[]> = {};

    incomes.forEach((income) => {
      // Formate a data para usar como chave
      const date = new Date(income.date);
      const formattedDate = date.toLocaleDateString('pt-BR');

      if (!groupedData[formattedDate]) {
        groupedData[formattedDate] = [];
      }
      groupedData[formattedDate].push(income);
    });
    return groupedData;
  }

  onFilter(): void {
    this.loadIncomes();
  }

  goToAddIncome(): void {
    this.router.navigate(['/incomes/add']);
  }

  onDeleteIncome(id: string): void {
    if (confirm('Tem certeza que deseja deletar esta receita?')) {
      this.incomesService.remove(id).subscribe({
        next: () => {
          this.loadIncomes();
        },
        error: (err) => {
          console.error('Erro ao deletar receita:', err);
        },
      });
    }
  }

  onEditIncome(id: string): void {
    this.router.navigate(['/incomes/edit', id]);
  }

  dateOrder(a: any, b: any) {
    const dateA = new Date(a.key.split('/').reverse().join('-'));
    const dateB = new Date(b.key.split('/').reverse().join('-'));
    return dateB.getTime() - dateA.getTime();
  }
}
