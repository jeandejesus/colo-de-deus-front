// src/app/components/payments-management/payments-management.component.ts

import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // ➡️ Importe MatSnackBar
import { PaymentsService } from '../services/payments.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { PaymentDialogComponent } from '../dialog/payment-dialog/payment-dialog.component';

@Component({
  selector: 'app-payments-management',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatIconModule,
    MatSnackBarModule,
    MatChipsModule,
    FormsModule,
    MatFormFieldModule,
  ],
  templateUrl: './payments-management.component.html',
  styleUrls: ['./payments-management.component.scss'],
})
export class PaymentsManagementComponent implements OnInit {
  displayedColumns: string[] = ['name', 'status', 'actions']; // Colunas para a MatTable
  users: any[] = [];
  isLoading = true;

  constructor(
    private paymentsService: PaymentsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog // ➡️ Injete MatSnackBar
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.isLoading = true;
    this.paymentsService.getUsersWithPaymentStatus().subscribe(
      (users) => {
        console.log('Usuários carregados:', users);
        this.users = users;
        this.isLoading = false;
      },
      (error) => {
        console.error('Erro ao buscar usuários:', error);
        this.snackBar.open('Erro ao carregar usuários.', 'Fechar', {
          duration: 3000,
        });
        this.isLoading = false;
      }
    );
  }

  markAsPaid(user: any): void {
    const dialogRef = this.dialog.open(PaymentDialogComponent, {
      width: '300px',
      data: { user },
    });

    dialogRef.afterClosed().subscribe((paymentAmount: number) => {
      if (!paymentAmount) return; // se cancelou, não faz nada

      this.paymentsService.markAsPaid(user._id, paymentAmount).subscribe(
        () => {
          user.hasPayment = true;
          this.snackBar.open('Pagamento registrado com sucesso!', 'Fechar', {
            duration: 3000,
          });
        },
        (error) => {
          console.error(error);
          this.snackBar.open('Falha ao registrar o pagamento.', 'Fechar', {
            duration: 3000,
          });
        }
      );
    });
  }
}
