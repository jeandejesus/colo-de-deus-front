// src/app/dashboard/dashboard.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ExpensesService } from '../expenses.service';
import { IncomesService } from '../incomes.service';
import { BalanceService } from '../balance.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgxChartsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  totalIncomes: number = 0;
  totalExpenses: number = 0;
  balance: number = 0;
  generalBalance: number = 0; // ⬅️ Nova propriedade para o saldo geral

  // Propriedades para o gráfico de pizza (despesas)
  expenseChartData: any[] = [];
  showLegend = true;
  showLabels = true;

  // Propriedades para o novo gráfico de barras (receitas vs despesas)
  barChartData: any[] = [];
  showBarLabels = true;
  showBarXAxis = true;
  showBarYAxis = true;

  constructor(
    private incomesService: IncomesService,
    private expensesService: ExpensesService,
    private balanceService: BalanceService
  ) {}

  ngOnInit(): void {
    forkJoin({
      incomes: this.incomesService.findAll(),
      expenses: this.expensesService.findAll(),
      generalBalanceData: this.balanceService.getBalance(), // ⬅️ Busca o saldo geral
    }).subscribe({
      next: ({ incomes, expenses, generalBalanceData }) => {
        this.totalIncomes = this.calculateTotal(incomes);
        this.totalExpenses = this.calculateTotal(expenses);
        this.balance = this.totalIncomes - this.totalExpenses;

        this.generalBalance = generalBalanceData.value; // ⬅️ Atribui o valor do saldo geral

        this.expenseChartData = this.formatDataForPieChart(expenses);
        this.barChartData = this.formatDataForBarChart(incomes, expenses);
      },
      error: (err) => {
        console.error('Erro ao carregar o dashboard:', err);
      },
    });
  }

  private formatDataForPieChart(expenses: any[]): any[] {
    const dataMap = new Map<string, number>();
    expenses.forEach((expense) => {
      const description = expense.description;
      const value = expense.value;
      if (dataMap.has(description)) {
        dataMap.set(description, dataMap.get(description)! + value);
      } else {
        dataMap.set(description, value);
      }
    });
    return Array.from(dataMap).map(([name, value]) => ({ name, value }));
  }

  // Novo método para formatar os dados para o gráfico de barras
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
}
