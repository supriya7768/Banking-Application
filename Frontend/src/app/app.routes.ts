import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CustomersComponent } from './components/customers/customers.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { LoansComponent } from './components/loans/loans.component';
import { BanksComponent } from './components/banks/banks.component';
import { RolesComponent } from './components/roles/roles.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'customers', component: CustomersComponent },
  { path: 'transactions', component: TransactionsComponent },
  { path: 'loans', component: LoansComponent },
  { path: 'banks', component: BanksComponent },
  { path: 'roles', component: RolesComponent },
  { path: '**', redirectTo: '/dashboard' }
];