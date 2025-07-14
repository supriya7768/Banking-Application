import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { DashboardStats } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-600">Welcome to your banking dashboard</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="stats-card bg-blue-600">
          <h3>{{ stats.totalCustomers }}</h3>
          <p>Total Customers</p>
        </div>
        
        <div class="stats-card bg-green-600">
          <h3>{{ stats.totalTransactions }}</h3>
          <p>Total Transactions</p>
        </div>
        
        <div class="stats-card bg-yellow-600">
          <h3>{{ stats.totalLoans }}</h3>
          <p>Total Loans</p>
        </div>
        
        <div class="stats-card bg-purple-600">
          <h3>\${{ stats.totalAmount | number:'1.2-2' }}</h3>
          <p>Total Amount</p>
        </div>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Recent Activity</h3>
          </div>
          <div class="card-body">
            <div class="space-y-4">
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p class="font-medium">Daily Transactions</p>
                  <p class="text-sm text-gray-600">Today</p>
                </div>
                <div class="text-right">
                  <p class="text-2xl font-bold text-blue-600">{{ stats.dailyTransactions }}</p>
                </div>
              </div>
              
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p class="font-medium">Pending Loans</p>
                  <p class="text-sm text-gray-600">Awaiting approval</p>
                </div>
                <div class="text-right">
                  <p class="text-2xl font-bold text-yellow-600">{{ stats.pendingLoans }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Quick Actions</h3>
          </div>
          <div class="card-body">
            <div class="grid grid-cols-2 gap-4">
              <a 
                href="#/customers" 
                class="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors"
              >
                <svg class="w-8 h-8 mx-auto mb-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
                <p class="font-medium text-blue-600">Add Customer</p>
              </a>
              
              <a 
                href="#/transactions" 
                class="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors"
              >
                <svg class="w-8 h-8 mx-auto mb-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p class="font-medium text-green-600">New Transaction</p>
              </a>
              
              <a 
                href="#/loans" 
                class="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg text-center transition-colors"
              >
                <svg class="w-8 h-8 mx-auto mb-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
                <p class="font-medium text-yellow-600">Process Loans</p>
              </a>
              
              <a 
                href="#/roles" 
                class="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors"
                *ngIf="authService.isSuperAdmin()"
              >
                <svg class="w-8 h-8 mx-auto mb-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                <p class="font-medium text-purple-600">Manage Roles</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .space-y-4 > * + * {
      margin-top: 1rem;
    }
    
    .stats-card {
      background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
      color: white;
      border-radius: 0.5rem;
      padding: 1.5rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
    
    .stats-card h3 {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    
    .stats-card p {
      font-size: 0.875rem;
      opacity: 0.9;
    }
    
    .bg-blue-600 { background: linear-gradient(135deg, #2563eb, #3b82f6); }
    .bg-green-600 { background: linear-gradient(135deg, #059669, #10b981); }
    .bg-yellow-600 { background: linear-gradient(135deg, #d97706, #f59e0b); }
    .bg-purple-600 { background: linear-gradient(135deg, #7c3aed, #8b5cf6); }
  `]
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalCustomers: 0,
    totalTransactions: 0,
    totalLoans: 0,
    totalAmount: 0,
    dailyTransactions: 0,
    pendingLoans: 0,
    activeCustomers: 0,
    monthlyRevenue: 0
  };

  constructor(
    private dataService: DataService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    const bankId = this.authService.isBankAdmin() ? this.authService.getCurrentUser()?.bankId : undefined;
    
    this.dataService.getDashboardStats(bankId).subscribe(stats => {
      this.stats = stats;
    });
  }
}