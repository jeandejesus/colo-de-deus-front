import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { take } from 'rxjs/operators';
import { HttpClientModule } from '@angular/common/http';
import { User } from '../../models/user';
import { UserService } from '../../services/users.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss'],
})
export default class UsersPageComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'trainer',
    'email',
    'vocationalYear',
    'actions',
  ];
  dataSource: User[] = [];
  total = 0;
  page = 1;
  limit = 10;
  loading = false;
  error = '';

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor(
    private usersService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  confirmDelete(user: User) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Excluir Usuário',
        message: `Tem certeza que deseja excluir ${user.name}?`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.deleteUser(user);
      }
    });
  }

  ngOnInit(): void {
    this.loadPage(this.page, this.limit);
  }

  loadPage(page: number, limit: number) {
    this.loading = true;
    this.error = '';
    this.usersService
      .getUsersPaginate(page, limit)
      .pipe(take(1))
      .subscribe({
        next: (res: { data: User[]; total: number }) => {
          this.dataSource = res.data;
          this.total = res.total;
          this.page = page;
          this.limit = limit;
          this.loading = false;
        },
        error: (err: { message: string }) => {
          this.loading = false;
          this.error = err?.message || 'Erro ao carregar usuários';
        },
      });
  }

  onPage(event: PageEvent) {
    const nextPage = event.pageIndex + 1; // MatPaginator pageIndex is 0-based
    const nextLimit = event.pageSize;
    this.loadPage(nextPage, nextLimit);
  }

  trackById(index: number, item: User) {
    return item._id;
  }

  deleteUser(user: User) {
    this.usersService.deleteUser(user._id).subscribe({
      next: () => {
        this.snackBar.open('Usuário removido com sucesso!', 'Fechar', {
          duration: 3000,
        });
        this.loadPage(this.page, this.limit);
      },
      error: (err: { error: { message: any }; message: any }) => {
        this.snackBar.open(
          'Erro ao excluir usuário: ' + (err.error?.message || err.message),
          'Fechar',
          {
            duration: 4000,
          }
        );
      },
    });
  }
}
