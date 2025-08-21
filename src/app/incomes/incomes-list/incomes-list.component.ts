// src/app/incomes/incomes-list/incomes-list.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncomesService } from '../../incomes.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-incomes-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './incomes-list.component.html',
  styleUrl: './incomes-list.component.scss',
})
export class IncomesListComponent implements OnInit {
  incomes: any[] = [];
  filteredIncomes: any[] = []; // ⬅️ Nova lista para os resultados filtrados
  startDate: string = ''; // ⬅️ Propriedade para a data de início
  endDate: string = ''; // ⬅️ Propriedade para a data de fim

  constructor(private incomesService: IncomesService, private router: Router) {}

  ngOnInit(): void {
    this.incomesService.findAll().subscribe({
      next: (data) => {
        this.incomes = data;
        this.filteredIncomes = data; // ⬅️ Inicialmente, exibe todos os itens
      },
      error: (err) => {
        console.error('Erro ao buscar receitas:', err);
      },
    });
  }

  onFilter(): void {
    const start = this.startDate ? new Date(this.startDate) : null;
    const end = this.endDate ? new Date(this.endDate) : null;

    this.filteredIncomes = this.incomes.filter((income) => {
      const incomeDate = new Date(income.date);
      const isAfterStart = start ? incomeDate >= start : true;
      const isBeforeEnd = end ? incomeDate <= end : true;

      return isAfterStart && isBeforeEnd;
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
