// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { IncomesListComponent } from './incomes/incomes-list/incomes-list.component';
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
import { RolesGuard } from './auth/guards/roles.guard';
import { PaymentsManagementComponent } from './payments-management/payments-management.component';
import { NoAuthGuard } from './auth/no-auth.guard';
import { RequestResetComponent } from './auth/request-reset/request-reset.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { PerfilComponent } from './user/perfil/perfil.component';
import { CalendarComponent } from './calendar/calendar.component';
import { EventFormComponent } from './event-form/event-form.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'reset', component: ResetPasswordComponent },
  { path: 'reset-password', component: RequestResetComponent },

  {
    path: '',
    component: AuthenticatedLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'agenda', component: CalendarComponent },
      { path: 'agenda/event', component: EventFormComponent },
      { path: 'agenda/event/:id', component: EventFormComponent },
      {
        path: 'incomes',
        component: IncomesListComponent,
        canActivate: [RolesGuard],
        data: { roles: ['admin', 'financeiro', 'lideranca'] },
      },
      { path: 'perfil', component: PerfilComponent },
      {
        path: 'incomes/add',
        component: IncomeFormComponent,
        canActivate: [RolesGuard],
        data: { roles: ['admin', 'financeiro'] },
      },
      {
        path: 'incomes/edit/:id',
        component: IncomeFormComponent,
        canActivate: [RolesGuard],
        data: { roles: ['admin', 'financeiro'] },
      },
      {
        path: 'expenses',
        component: ExpensesListComponent,
        canActivate: [RolesGuard],
        data: { roles: ['admin', 'financeiro', 'lideranca'] },
      },
      {
        path: 'expenses/add',
        component: ExpenseFormComponent,
        canActivate: [RolesGuard],
        data: { roles: ['admin', 'financeiro'] },
      },
      {
        path: 'expenses/edit/:id',
        component: ExpenseFormComponent,
        canActivate: [RolesGuard],
        data: { roles: ['admin', 'financeiro'] },
      },
      {
        path: 'balance',
        component: BalanceFormComponent,
        canActivate: [RolesGuard],
        data: { roles: ['admin', 'financeiro'] },
      },
      {
        path: 'categories',
        component: CategoriesListComponent,
        canActivate: [RolesGuard],
        data: { roles: ['admin', 'financeiro'] },
      },
      {
        path: 'categories/add',
        component: CategoriesFormComponent,
        canActivate: [RolesGuard],
        data: { roles: ['admin', 'financeiro'] },
      },
      {
        path: 'categories/edit/:id',
        component: CategoriesFormComponent,
        canActivate: [RolesGuard],
        data: { roles: ['admin', 'financeiro'] },
      },
      {
        path: 'admin/permissions',
        component: ManagePermissionsComponent,
        canActivate: [RolesGuard],
        data: { roles: ['admin'] },
      },
      {
        path: 'admin/payments-status',
        component: PaymentsManagementComponent,
        canActivate: [RolesGuard],
        data: { roles: ['admin', 'financeiro'] },
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      // Adicione a rota catch-all aqui
      { path: '**', redirectTo: 'dashboard' },
    ],
  },
  // A rota catch-all para o caso de o usuário não estar logado
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];
