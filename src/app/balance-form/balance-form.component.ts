// src/app/balance-form/balance-form.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BalanceService } from '../balance.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-balance-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './balance-form.component.html',
  styleUrl: './balance-form.component.scss',
})
export class BalanceFormComponent {
  balanceValue: number = 0;

  constructor(private balanceService: BalanceService, public router: Router) {}

  saveBalance(): void {
    this.balanceService.setBalance(this.balanceValue).subscribe({
      next: () => {
        alert('Saldo geral atualizado com sucesso!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Erro ao salvar o saldo:', err);
        alert('Erro ao salvar o saldo. Por favor, tente novamente.');
      },
    });
  }
}
