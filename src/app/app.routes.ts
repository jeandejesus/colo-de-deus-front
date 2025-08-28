// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { IncomesListComponent } from './incomes/incomes-list/incomes-list.component'; // Verifique essa importação
import { ExpensesListComponent } from './expenses/expenses-list/expenses-list.component';
import { AuthGuard } from './auth.guard';
import { IncomeFormComponent } from './incomes/income-form/income-form.component';
import { ExpenseFormComponent } from './expenses/expense-form/expense-form.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthenticatedLayoutComponent } from './shared/authenticated-layout/authenticated-layout.component';
import { BalanceFormComponent } from './balance-form/balance-form.component';
import { CategoriesFormComponent } from './categories/categories-form/categories-form.component';
import { CategoriesListComponent } from './categories/categories-list/categories-list.component';
import { ManagePermissionsComponent } from './admin/manage-permissions/manage-permissions.component';
import { RolesGuard } from './auth/guards/roles.guard'; // Importe o guard

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: AuthenticatedLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'incomes', component: IncomesListComponent },
      {
        path: 'incomes/add',
        component: IncomeFormComponent,
        canActivate: [RolesGuard],
        data: {
          roles: ['admin', 'financeiro'],
        },
      },
      {
        path: 'incomes/edit/:id',
        component: IncomeFormComponent,
        canActivate: [RolesGuard],
        data: {
          roles: ['admin', 'financeiro'],
        },
      },
      { path: 'expenses', component: ExpensesListComponent },
      {
        path: 'expenses/add',
        component: ExpenseFormComponent,
        canActivate: [RolesGuard],
        data: {
          roles: ['admin', 'financeiro'],
        },
      },
      {
        path: 'expenses/edit/:id',
        component: ExpenseFormComponent,
        canActivate: [RolesGuard],
        data: {
          roles: ['admin', 'financeiro'],
        },
      },
      {
        path: 'balance',
        component: BalanceFormComponent,
        canActivate: [RolesGuard],
        data: {
          roles: ['admin', 'financeiro'],
        },
      },
      {
        path: 'categories',
        component: CategoriesListComponent,
        canActivate: [RolesGuard],
        data: {
          roles: ['admin', 'financeiro'],
        },
      },
      {
        path: 'categories/add',
        component: CategoriesFormComponent,
        canActivate: [RolesGuard],
        data: {
          roles: ['admin', 'financeiro'],
        },
      }, // ⬅️ Rota para adicionar categoria
      {
        path: 'categories/edit/:id',
        component: CategoriesFormComponent,
        canActivate: [RolesGuard],
        data: {
          roles: ['admin', 'financeiro'],
        },
      }, // ⬅️ Rota para editar categoria

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'admin/permissions',
        component: ManagePermissionsComponent,
        canActivate: [RolesGuard],
        data: {
          roles: ['admin'],
        },
      },
    ],
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];
