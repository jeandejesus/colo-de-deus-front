// src/app/dashboard/dashboard.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { LegendPosition, NgxChartsModule } from '@swimlane/ngx-charts';
import { ExpensesService } from '../services/expenses.service';
import { IncomesService } from '../services/incomes.service';
import { BalanceService } from '../services/balance.service';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyMaskPipe } from '../pipes/currency-mask.pipe';
import { LoadingScreenComponent } from '../shared/loading-screen/loading-screen.component'; // ✅ Importe aqui
import {
  MatFormField,
  MatSelect,
  MatSelectModule,
} from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { PermissionDirective } from '../directives/permission.directive';
import { UserService } from '../services/users.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NgxChartsModule,
    RouterModule,
    MatCardModule,
    FormsModule,
    MatIconModule,
    MatFormField,
    MatSelectModule,
    CurrencyMaskPipe,
    CurrencyPipe,
    LoadingScreenComponent,
    PermissionDirective,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  legendPosition: LegendPosition = LegendPosition.Below;
  isLoading: boolean = true;
  totalIncomes: number = 0;
  totalExpenses: number = 0;
  balance: number = 0;
  generalBalance: number = 0;
  progress: any | null = null;
  loading = true;

  // Propriedades para o gráfico de pizza (despesas)
  expenseChartData: any[] = [];

  // ⬅️ Nova propriedade para o gráfico de receitas
  incomeChartData: any[] = [];

  showLegend = true;
  showLabels = true;

  // Propriedades para o novo gráfico de barras (receitas vs despesas)
  barChartData: any[] = [];
  showBarLabels = true;
  showBarXAxis = true;
  showBarYAxis = true;
  showValues: boolean = false;

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

  colorScheme = [
    { name: 'Despesas', value: 'rgb(168, 56, 93)' },
    { name: 'Receitas', value: 'rgba(78, 168, 56, 1)' },
  ];
  constructor(
    private incomesService: IncomesService,
    private expensesService: ExpensesService,
    private balanceService: BalanceService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const now = new Date();
    this.isLoading = true;

    const startOfMonth = new Date(now.getFullYear(), this.selectedMonth, 1)
      .toISOString()
      .substring(0, 10);
    const endOfMonth = new Date(now.getFullYear(), this.selectedMonth + 1, 0)
      .toISOString()
      .substring(0, 10);

    forkJoin({
      incomes: this.incomesService.findAll(startOfMonth, endOfMonth),
      expenses: this.expensesService.findAll(startOfMonth, endOfMonth),
      generalBalanceData: this.balanceService.getBalance(),
    }).subscribe({
      next: ({ incomes, expenses, generalBalanceData }) => {
        this.totalIncomes = this.calculateTotal(incomes);
        this.totalExpenses = this.calculateTotal(expenses);
        this.balance = this.totalIncomes - this.totalExpenses;
        this.generalBalance = generalBalanceData.value;

        // ⬅️ Cria os dados para os gráficos
        this.expenseChartData = this.formatDataForPieChart(expenses);
        this.incomeChartData = this.formatDataForPieChart(incomes);
        this.barChartData = this.formatDataForBarChart(incomes, expenses);
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;

        console.error('Erro ao carregar o dashboard:', err);
      },
    });

    this.loadProgress();
  }

  onRoleChange(): void {
    this.ngOnInit();
  }

  private formatDataForPieChart(items: any[]): any[] {
    const dataMap = new Map<string, number>();

    items.forEach((item) => {
      const categoryName = item.category?.name || 'Sem Categoria';
      const currentValue = dataMap.get(categoryName) || 0;
      dataMap.set(categoryName, currentValue + item.value);
    });

    const formattedData = Array.from(dataMap.entries()).map(
      ([name, value]) => ({
        name,
        value,
      })
    );

    return formattedData;
  }

  private formatDataForBarChart(incomes: any[], expenses: any[]): any[] {
    const monthlyData = new Map<
      string,
      { incomes: number; expenses: number }
    >();

    const processItems = (items: any[], type: 'incomes' | 'expenses') => {
      items.forEach((item) => {
        const date = new Date(item.date);
        const month = `${date.getMonth() + 1}/${date.getFullYear()}`;
        if (!monthlyData.has(month)) {
          monthlyData.set(month, { incomes: 0, expenses: 0 });
        }
        monthlyData.get(month)![type] += item.value;
      });
    };

    processItems(incomes, 'incomes');
    processItems(expenses, 'expenses');

    const formattedData = Array.from(monthlyData)
      .map(([name, values]) => {
        return {
          name: name,
          series: [
            { name: 'Receitas', value: values.incomes },
            { name: 'Despesas', value: values.expenses },
          ],
        };
      })
      .sort((a, b) => {
        const [aMonth, aYear] = a.name.split('/').map(Number);
        const [bMonth, bYear] = b.name.split('/').map(Number);
        return (
          new Date(aYear, aMonth - 1).getTime() -
          new Date(bYear, bMonth - 1).getTime()
        );
      });

    return formattedData;
  }

  private calculateTotal(items: any[]): number {
    return items.reduce((sum, item) => sum + item.value, 0);
  }

  toggleValues(): void {
    this.showValues = !this.showValues;
  }

  loadProgress() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), this.selectedMonth, 1)
      .toISOString()
      .substring(0, 10);
    const endOfMonth = new Date(now.getFullYear(), this.selectedMonth + 1, 0)
      .toISOString()
      .substring(0, 10);

    this.userService.getMonthlyProgress(startOfMonth, endOfMonth).subscribe({
      next: (data) => {
        this.progress = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar progresso mensal:', err);
        this.loading = false;
      },
    });
  }

  getProgressColor(): string {
    if (!this.progress) return '#333';
    if (this.progress.paidPercentage >= 80) return '#22c55e'; // verde
    if (this.progress.paidPercentage >= 50) return '#eab308'; // amarelo
    return '#ef4444'; // vermelho
  }
}
