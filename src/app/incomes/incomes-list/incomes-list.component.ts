// src/app/incomes/incomes-list/incomes-list.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncomesService } from '../../services/incomes.service';
import { Router, RouterModule } from '@angular/router'; // ⬅️ Adicionado RouterModule
import { FormsModule } from '@angular/forms';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { PermissionDirective } from '../../directives/permission.directive';

@Component({
  selector: 'app-incomes-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    DateFormatPipe,
    PermissionDirective,
  ], // ⬅️ Adicionado RouterModule
  templateUrl: './incomes-list.component.html',
  styleUrl: './incomes-list.component.scss',
})
export class IncomesListComponent implements OnInit {
  incomes: any[] = []; // ⬅️ Agora esta é a única lista que precisamos
  startDate: string = '';
  endDate: string = '';

  constructor(private incomesService: IncomesService, private router: Router) {}

  ngOnInit(): void {
    this.loadIncomes();
  }

  loadIncomes(): void {
    this.incomesService.findAll(this.startDate, this.endDate).subscribe({
      next: (data) => {
        console.log('Receitas carregadas:', data);

        this.incomes = [...data];
      },
      error: (err) => {
        console.error('Erro ao buscar receitas:', err);
      },
    });
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
}
