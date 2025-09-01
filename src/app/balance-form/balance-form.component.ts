// src/app/balance-form/balance-form.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BalanceService } from '../services/balance.service';
import { Router } from '@angular/router';
import { CurrencyMaskPipe } from '../pipes/currency-mask.pipe';

@Component({
  selector: 'app-balance-form',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyMaskPipe],
  templateUrl: './balance-form.component.html',
  styleUrl: './balance-form.component.scss',
})
export class BalanceFormComponent {
  balanceValue: string = '0';

  constructor(private balanceService: BalanceService, public router: Router) {}

  saveBalance(): void {
    // 1. Remove "R$", espaços e pontos
    const cleaned = this.balanceValue.replace(/R\$\s?/g, '').replace(/\./g, '');

    // 2. Troca vírgula decimal (se houver) por ponto
    const normalized = cleaned.replace(',', '.');

    // 3. Converte para número
    const numberValue = Number(normalized);
    console.log(numberValue);
    this.balanceService.setBalance(numberValue).subscribe({
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
