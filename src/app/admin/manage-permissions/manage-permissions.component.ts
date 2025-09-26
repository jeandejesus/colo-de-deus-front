// src/app/admin/manage-permissions/manage-permissions.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/users.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { LoadingScreenComponent } from '../../shared/loading-screen/loading-screen.component';
@Component({
  selector: 'app-manage-permissions',
  templateUrl: './manage-permissions.component.html',
  styleUrl: './manage-permissions.component.scss',

  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatIconModule,
    MatInputModule,
    LoadingScreenComponent,
  ],
})
export class ManagePermissionsComponent implements OnInit {
  users: any[] = [];
  roles = ['admin', 'financeiro', 'membro', 'lideranca', 'agenda'];
  errorMessage: string | null = null;
  isLoading: boolean = true;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.isLoading = true;
    this.errorMessage = null; // Limpa a mensagem de erro

    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        // ➡️ Lógica para exibir a mensagem do backend
        if (
          error.error &&
          error.error.messages &&
          error.error.messages.length > 0
        ) {
          this.errorMessage = error.error.messages[0];
        } else if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage =
            'Ocorreu um erro desconhecido ao carregar usuários.';
        }
      },
    });
  }

  trackByUser(index: number, user: any): string {
    return user._id;
  }

  onRoleChange(user: any): void {
    this.userService.updateUserRole(user._id, user.role).subscribe({
      // Use o serviço para atualizar o papel
      next: (updatedUser) => {
        console.log('Papel atualizado com sucesso:', updatedUser);
      },
      error: (err) => {
        this.errorMessage = 'Erro ao atualizar o papel do usuário.';
        this.fetchUsers(); // Recarrega a lista em caso de erro
      },
    });
  }
}
