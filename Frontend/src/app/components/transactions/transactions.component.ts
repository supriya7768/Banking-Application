import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { Transaction, Customer } from '../../models/user.model';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Transactions</h1>
          <p class="text-gray-600">View and manage transactions</p>
        </div>
        <button 
          (click)="openCreateModal()" 
          class="btn btn-primary"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          New Transaction
        </button>
      </div>
      
      <div class="card">
        <div class="card-body">
          <div class="overflow-x-auto">
            <table class="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>From Account</th>
                  <th>To Account</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let transaction of transactions">
                  <td>
                    <div>
                      <p class="font-medium">{{ transaction.createdAt | date:'short' }}</p>
                      <p class="text-sm text-gray-600">{{ transaction.id }}</p>
                    </div>
                  </td>
                  <td>
                    <span class="font-mono text-sm">{{ transaction.fromAccountNumber }}</span>
                  </td>
                  <td>
                    <span class="font-mono text-sm">{{ transaction.toAccountNumber }}</span>
                  </td>
                  <td class="font-semibold">
                    <span [class]="transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'">
                      {{ transaction.type === 'credit' ? '+' : '-' }}\${{ transaction.amount | number:'1.2-2' }}
                    </span>
                  </td>
                  <td>{{ transaction.description }}</td>
                  <td>
                    <span 
                      class="badge"
                      [class]="getStatusBadgeClass(transaction.status)"
                    >
                      {{ transaction.status | titlecase }}
                    </span>
                  </td>
                  <td>
                    <span 
                      class="badge"
                      [class]="transaction.type === 'credit' ? 'badge-success' : 'badge-error'"
                    >
                      {{ transaction.type | titlecase }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Create Transaction Modal -->
    <div *ngIf="showModal" class="modal-overlay" (click)="closeModal()">
      <div class="modal-content w-full max-w-md" (click)="$event.stopPropagation()">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">New Transaction</h3>
          </div>
          <div class="card-body">
            <form (ngSubmit)="saveTransaction()" #transactionForm="ngForm">
              <div class="form-group">
                <label class="form-label">From Account</label>
                <select 
                  class="form-select" 
                  [(ngModel)]="transactionData.fromAccountNumber" 
                  name="fromAccountNumber"
                  required
                >
                  <option value="">Select Account</option>
                  <option *ngFor="let customer of customers" [value]="customer.accountNumber">
                    {{ customer.accountNumber }} - {{ customer.name }}
                  </option>
                </select>
              </div>
              
              <div class="form-group">
                <label class="form-label">To Account Number</label>
                <input 
                  type="text" 
                  class="form-input" 
                  [(ngModel)]="transactionData.toAccountNumber" 
                  name="toAccountNumber"
                  placeholder="Enter account number"
                  required
                >
              </div>
              
              <div class="form-group">
                <label class="form-label">Amount</label>
                <input 
                  type="number" 
                  class="form-input" 
                  [(ngModel)]="transactionData.amount" 
                  name="amount"
                  min="0.01"
                  step="0.01"
                  required
                >
              </div>
              
              <div class="form-group">
                <label class="form-label">Description</label>
                <input 
                  type="text" 
                  class="form-input" 
                  [(ngModel)]="transactionData.description" 
                  name="description"
                  placeholder="Enter description"
                  required
                >
              </div>
              
              <div class="flex justify-end space-x-2 mt-6">
                <button type="button" (click)="closeModal()" class="btn btn-secondary">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  class="btn btn-primary"
                  [disabled]="!transactionForm.valid"
                >
                  Process Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .space-x-2 > * + * {
      margin-left: 0.5rem;
    }
  `]
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  customers: Customer[] = [];
  showModal = false;
  
  transactionData = {
    fromAccountNumber: '',
    toAccountNumber: '',
    amount: 0,
    description: ''
  };

  constructor(
    private dataService: DataService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.loadTransactions();
    this.loadCustomers();
  }

  loadTransactions() {
    const bankId = this.authService.isBankAdmin() ? this.authService.getCurrentUser()?.bankId : undefined;
    
    this.dataService.getTransactions(bankId).subscribe(transactions => {
      this.transactions = transactions;
    });
  }

  loadCustomers() {
    const bankId = this.authService.isBankAdmin() ? this.authService.getCurrentUser()?.bankId : undefined;
    
    this.dataService.getCustomers(bankId).subscribe(customers => {
      this.customers = customers;
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'completed':
        return 'badge-success';
      case 'pending':
        return 'badge-warning';
      case 'failed':
        return 'badge-error';
      default:
        return 'badge-info';
    }
  }

  openCreateModal() {
    this.transactionData = {
      fromAccountNumber: '',
      toAccountNumber: '',
      amount: 0,
      description: ''
    };
    this.showModal = true;
  }

  saveTransaction() {
    const bankId = this.authService.getCurrentUser()?.bankId || 'bank-abc';
    
    this.dataService.createTransaction({
      ...this.transactionData,
      type: 'debit',
      status: 'completed',
      bankId
    }).subscribe(() => {
      this.loadTransactions();
      this.closeModal();
    });
  }

  closeModal() {
    this.showModal = false;
  }
}