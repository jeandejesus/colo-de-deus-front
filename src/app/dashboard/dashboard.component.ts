// src/app/dashboard/dashboard.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ExpensesService } from '../services/expenses.service';
import { IncomesService } from '../services/incomes.service';
import { BalanceService } from '../services/balance.service';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NgxChartsModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  totalIncomes: number = 0;
  totalExpenses: number = 0;
  balance: number = 0;
  generalBalance: number = 0;

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

  constructor(
    private incomesService: IncomesService,
    private expensesService: ExpensesService,
    private balanceService: BalanceService
  ) {}

  ngOnInit(): void {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .substring(0, 10);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
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
      },
      error: (err) => {
        console.error('Erro ao carregar o dashboard:', err);
      },
    });
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
}
