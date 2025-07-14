import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { Customer } from '../../models/user.model';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Customers</h1>
          <p class="text-gray-600">Manage customer accounts</p>
        </div>
        <button 
          (click)="openCreateModal()" 
          class="btn btn-primary"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add Customer
        </button>
      </div>
      
      <div class="card">
        <div class="card-body">
          <div class="overflow-x-auto">
            <table class="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Account Number</th>
                  <th>Balance</th>
                  <th>Bank</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let customer of customers">
                  <td>
                    <div>
                      <p class="font-medium">{{ customer.name }}</p>
                      <p class="text-sm text-gray-600">{{ customer.phone }}</p>
                    </div>
                  </td>
                  <td>{{ customer.email }}</td>
                  <td>
                    <span class="font-mono text-sm">{{ customer.accountNumber }}</span>
                  </td>
                  <td class="font-semibold text-green-600">
                    \${{ customer.balance | number:'1.2-2' }}
                  </td>
                  <td>
                    <span class="badge badge-info">{{ getBankName(customer.bankId) }}</span>
                  </td>
                  <td>
                    <div class="flex space-x-2">
                      <button 
                        (click)="editCustomer(customer)" 
                        class="btn btn-sm btn-secondary"
                      >
                        Edit
                      </button>
                      <button 
                        (click)="deleteCustomer(customer.id)" 
                        class="btn btn-sm btn-error"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Create/Edit Modal -->
    <div *ngIf="showModal" class="modal-overlay" (click)="closeModal()">
      <div class="customer-modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div class="modal-title-section">
            <div class="modal-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <div>
              <h3 class="modal-title">{{ editingCustomer ? 'Edit Customer' : 'Add New Customer' }}</h3>
              <p class="modal-subtitle">{{ editingCustomer ? 'Update customer information' : 'Create a new customer account' }}</p>
            </div>
          </div>
          <button (click)="closeModal()" class="modal-close-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <form (ngSubmit)="saveCustomer()" #customerForm="ngForm">
            <div class="form-grid">
              <!-- Personal Information Section -->
              <div class="form-section">
                <h4 class="section-title">Personal Information</h4>
                <div class="section-grid">
                  <div class="form-group">
                    <label class="form-label">
                      <span class="label-text">Full Name</span>
                      <span class="label-required">*</span>
                    </label>
                    <input 
                      type="text" 
                      class="form-input" 
                      [(ngModel)]="customerData.name" 
                      name="name"
                      placeholder="Enter full name"
                      required
                    >
                  </div>
                  
                  <div class="form-group">
                    <label class="form-label">
                      <span class="label-text">Email Address</span>
                      <span class="label-required">*</span>
                    </label>
                    <input 
                      type="email" 
                      class="form-input" 
                      [(ngModel)]="customerData.email" 
                      name="email"
                      placeholder="Enter email address"
                      required
                    >
                  </div>
                  
                  <div class="form-group">
                    <label class="form-label">
                      <span class="label-text">Phone Number</span>
                      <span class="label-required">*</span>
                    </label>
                    <input 
                      type="text" 
                      class="form-input" 
                      [(ngModel)]="customerData.phone" 
                      name="phone"
                      placeholder="Enter phone number"
                      required
                    >
                  </div>
                  
                  <div class="form-group">
                    <label class="form-label">
                      <span class="label-text">Date of Birth</span>
                      <span class="label-required">*</span>
                    </label>
                    <input 
                      type="date" 
                      class="form-input" 
                      [(ngModel)]="customerData.dateOfBirth" 
                      name="dateOfBirth"
                      required
                    >
                  </div>
                  
                  <div class="form-group">
                    <label class="form-label">
                      <span class="label-text">Occupation</span>
                      <span class="label-required">*</span>
                    </label>
                    <input 
                      type="text" 
                      class="form-input" 
                      [(ngModel)]="customerData.occupation" 
                      name="occupation"
                      placeholder="Enter occupation"
                      required
                    >
                  </div>
                  
                  <div class="form-group form-group-full">
                    <label class="form-label">
                      <span class="label-text">Address</span>
                      <span class="label-required">*</span>
                    </label>
                    <textarea 
                      class="form-input" 
                      [(ngModel)]="customerData.address" 
                      name="address"
                      rows="3"
                      placeholder="Enter full address"
                      required
                    ></textarea>
                  </div>
                </div>
              </div>
              
              <!-- Account Information Section -->
              <div class="form-section">
                <h4 class="section-title">Account Information</h4>
                <div class="section-grid">
                  <div class="form-group">
                    <label class="form-label">
                      <span class="label-text">Account Number</span>
                      <span class="label-required">*</span>
                    </label>
                    <input 
                      type="text" 
                      class="form-input" 
                      [(ngModel)]="customerData.accountNumber" 
                      name="accountNumber"
                      placeholder="Auto-generated"
                      readonly
                      required
                    >
                  </div>
                  
                  <div class="form-group">
                    <label class="form-label">
                      <span class="label-text">Initial Balance</span>
                      <span class="label-required">*</span>
                    </label>
                    <div class="input-with-prefix">
                      <span class="input-prefix">$</span>
                      <input 
                        type="number" 
                        class="form-input" 
                        [(ngModel)]="customerData.balance" 
                        name="balance"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        required
                      >
                    </div>
                  </div>
                  
                  <div class="form-group" *ngIf="authService.isSuperAdmin()">
                    <label class="form-label">
                      <span class="label-text">Bank</span>
                      <span class="label-required">*</span>
                    </label>
                    <select 
                      class="form-select" 
                      [(ngModel)]="customerData.bankId" 
                      name="bankId"
                      required
                    >
                      <option value="">Select Bank</option>
                      <option *ngFor="let bank of banks" [value]="bank.id">
                        {{ bank.name }} ({{ bank.code }})
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="modal-footer">
              <button type="button" (click)="closeModal()" class="btn btn-secondary">
                Cancel
              </button>
              <button 
                type="submit" 
                class="btn btn-primary"
                [disabled]="!customerForm.valid"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" *ngIf="!editingCustomer">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" *ngIf="editingCustomer">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                {{ editingCustomer ? 'Update Customer' : 'Create Customer' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .space-x-2 > * + * {
      margin-left: 0.5rem;
    }
    
    .customer-modal {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      width: 90vw;
      max-width: 800px;
      max-height: 90vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 2rem;
      border-bottom: 1px solid #f1f5f9;
      background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
    }
    
    .modal-title-section {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .modal-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 3rem;
      height: 3rem;
      background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
      border-radius: 0.75rem;
      color: white;
      box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
    }
    
    .modal-icon svg {
      width: 1.5rem;
      height: 1.5rem;
    }
    
    .modal-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
    }
    
    .modal-subtitle {
      font-size: 0.875rem;
      color: #64748b;
      margin: 0.25rem 0 0 0;
    }
    
    .modal-close-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .modal-close-btn:hover {
      background: #e2e8f0;
      color: #475569;
    }
    
    .modal-close-btn svg {
      width: 1.25rem;
      height: 1.25rem;
    }
    
    .modal-body {
      flex: 1;
      overflow-y: auto;
      padding: 2rem;
    }
    
    .form-grid {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    
    .form-section {
      background: #f8fafc;
      border-radius: 0.75rem;
      padding: 1.5rem;
      border: 1px solid #e2e8f0;
    }
    
    .section-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 1.5rem 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .section-title::before {
      content: '';
      width: 4px;
      height: 1.5rem;
      background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
      border-radius: 2px;
    }
    
    .section-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }
    
    .form-group-full {
      grid-column: 1 / -1;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
    }
    
    .form-label {
      display: flex;
      align-items: center;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #374151;
      font-size: 0.875rem;
    }
    
    .label-text {
      margin-right: 0.25rem;
    }
    
    .label-required {
      color: #ef4444;
      font-weight: 500;
    }
    
    .form-input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      transition: all 0.2s ease;
      background: white;
    }
    
    .form-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .form-input:read-only {
      background: #f9fafb;
      color: #6b7280;
    }
    
    .form-select {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      background: white;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .form-select:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .input-with-prefix {
      position: relative;
      display: flex;
      align-items: center;
    }
    
    .input-prefix {
      position: absolute;
      left: 1rem;
      color: #6b7280;
      font-weight: 500;
      z-index: 1;
    }
    
    .input-with-prefix .form-input {
      padding-left: 2.5rem;
    }
    
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      padding: 2rem;
      border-top: 1px solid #f1f5f9;
      background: #f8fafc;
    }
    
    @media (max-width: 768px) {
      .customer-modal {
        width: 95vw;
        max-height: 95vh;
      }
      
      .modal-header,
      .modal-body,
      .modal-footer {
        padding: 1.5rem;
      }
      
      .section-grid {
        grid-template-columns: 1fr;
      }
      
      .modal-title {
        font-size: 1.25rem;
      }
      
      .modal-footer {
        flex-direction: column-reverse;
      }
      
      .modal-footer .btn {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  banks: any[] = [];
  showModal = false;
  editingCustomer: Customer | null = null;
  
  customerData = {
    name: '',
    email: '',
    phone: '',
    address: '',
    accountNumber: '',
    balance: 0,
    dateOfBirth: '',
    occupation: '',
    bankId: ''
  };

  constructor(
    private dataService: DataService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.loadCustomers();
    this.loadBanks();
  }

  loadCustomers() {
    const bankId = this.authService.isBankAdmin() ? this.authService.getCurrentUser()?.bankId : undefined;
    
    this.dataService.getCustomers(bankId).subscribe(customers => {
      this.customers = customers;
    });
  }

  loadBanks() {
    this.banks = this.authService.getBanks();
  }

  getBankName(bankId: string): string {
    const bank = this.banks.find(b => b.id === bankId);
    return bank ? bank.name : 'Unknown';
  }

  openCreateModal() {
    this.editingCustomer = null;
    this.customerData = {
      name: '',
      email: '',
      phone: '',
      address: '',
      accountNumber: this.generateAccountNumber(),
      balance: 0,
      dateOfBirth: '',
      occupation: '',
      bankId: this.authService.isBankAdmin() ? this.authService.getCurrentUser()?.bankId || '' : ''
    };
    this.showModal = true;
  }

  editCustomer(customer: Customer) {
    this.editingCustomer = customer;
    this.customerData = {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      accountNumber: customer.accountNumber,
      balance: customer.balance,
      dateOfBirth: customer.dateOfBirth.toISOString().split('T')[0],
      occupation: customer.occupation,
      bankId: customer.bankId
    };
    this.showModal = true;
  }

  saveCustomer() {
    if (this.editingCustomer) {
      this.dataService.updateCustomer(this.editingCustomer.id, {
        ...this.customerData,
        dateOfBirth: new Date(this.customerData.dateOfBirth)
      }).subscribe(() => {
        this.loadCustomers();
        this.closeModal();
      });
    } else {
      this.dataService.createCustomer({
        ...this.customerData,
        dateOfBirth: new Date(this.customerData.dateOfBirth)
      }).subscribe(() => {
        this.loadCustomers();
        this.closeModal();
      });
    }
  }

  deleteCustomer(id: string) {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.dataService.deleteCustomer(id).subscribe(() => {
        this.loadCustomers();
      });
    }
  }

  closeModal() {
    this.showModal = false;
    this.editingCustomer = null;
  }

  generateAccountNumber(): string {
    const bank = this.authService.getCurrentUserBank();
    const bankCode = bank?.code || 'ABC';
    const randomNum = Math.floor(Math.random() * 10000) + 1000;
    return `${bankCode}${randomNum}`;
  }
}