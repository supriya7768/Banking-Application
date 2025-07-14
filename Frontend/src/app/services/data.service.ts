import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Customer, Transaction, Loan, DashboardStats } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private customersSubject = new BehaviorSubject<Customer[]>([]);
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  private loansSubject = new BehaviorSubject<Loan[]>([]);

  private customers: Customer[] = [
    {
      id: 'cust-1',
      name: 'Alexander Thompson',
      email: 'alexander.thompson@email.com',
      phone: '+1 (555) 234-5678',
      address: '789 Executive Plaza, Suite 1200, Manhattan, NY 10022',
      accountNumber: 'FNB100001',
      bankId: 'bank-abc',
      balance: 125000.50,
      dateOfBirth: new Date('1985-03-15'),
      occupation: 'Senior Software Architect',
      status: 'active',
      createdAt: new Date('2022-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: 'cust-2',
      name: 'Victoria Chen',
      email: 'victoria.chen@email.com',
      phone: '+1 (555) 345-6789',
      address: '456 Corporate Center, Floor 25, Chicago, IL 60601',
      accountNumber: 'FNB100002',
      bankId: 'bank-abc',
      balance: 89750.25,
      dateOfBirth: new Date('1990-07-22'),
      occupation: 'Investment Manager',
      status: 'active',
      createdAt: new Date('2022-03-10'),
      updatedAt: new Date('2024-01-10')
    },
    {
      id: 'cust-3',
      name: 'Michael Rodriguez',
      email: 'michael.rodriguez@email.com',
      phone: '+1 (555) 456-7890',
      address: '321 Business District, Tower B, Los Angeles, CA 90210',
      accountNumber: 'MTB200001',
      bankId: 'bank-xyz',
      balance: 156300.75,
      dateOfBirth: new Date('1982-11-08'),
      occupation: 'Business Consultant',
      status: 'active',
      createdAt: new Date('2021-11-20'),
      updatedAt: new Date('2024-01-05')
    }
  ];

  private transactions: Transaction[] = [
    {
      id: 'txn-1',
      fromAccountNumber: 'FNB100001',
      toAccountNumber: 'FNB100002',
      amount: 2500.00,
      description: 'Professional services payment',
      type: 'transfer',
      status: 'completed',
      bankId: 'bank-abc',
      reference: 'TXN-2024-001',
      createdAt: new Date('2024-01-15T10:30:00'),
      updatedAt: new Date('2024-01-15T10:30:00')
    },
    {
      id: 'txn-2',
      fromAccountNumber: 'FNB100002',
      toAccountNumber: 'MTB200001',
      amount: 5000.00,
      description: 'Inter-bank transfer',
      type: 'transfer',
      status: 'completed',
      bankId: 'bank-abc',
      reference: 'TXN-2024-002',
      createdAt: new Date('2024-01-14T14:15:00'),
      updatedAt: new Date('2024-01-14T14:15:00')
    },
    {
      id: 'txn-3',
      fromAccountNumber: 'MTB200001',
      toAccountNumber: 'FNB100001',
      amount: 1750.50,
      description: 'Consulting fee payment',
      type: 'transfer',
      status: 'pending',
      bankId: 'bank-xyz',
      reference: 'TXN-2024-003',
      createdAt: new Date('2024-01-16T09:45:00'),
      updatedAt: new Date('2024-01-16T09:45:00')
    }
  ];

  private loans: Loan[] = [
    {
      id: 'loan-1',
      customerId: 'cust-1',
      customerName: 'Alexander Thompson',
      loanType: 'business',
      amount: 250000,
      interestRate: 6.5,
      term: 60,
      status: 'approved',
      appliedAt: new Date('2023-12-01'),
      approvedAt: new Date('2023-12-15'),
      bankId: 'bank-abc',
      monthlyPayment: 4875.32
    },
    {
      id: 'loan-2',
      customerId: 'cust-2',
      customerName: 'Victoria Chen',
      loanType: 'home',
      amount: 450000,
      interestRate: 5.8,
      term: 360,
      status: 'pending',
      appliedAt: new Date('2024-01-10'),
      bankId: 'bank-abc',
      monthlyPayment: 2645.18
    },
    {
      id: 'loan-3',
      customerId: 'cust-3',
      customerName: 'Michael Rodriguez',
      loanType: 'auto',
      amount: 65000,
      interestRate: 4.9,
      term: 72,
      status: 'disbursed',
      appliedAt: new Date('2023-11-15'),
      approvedAt: new Date('2023-11-25'),
      disbursedAt: new Date('2023-12-01'),
      bankId: 'bank-xyz',
      monthlyPayment: 1045.67
    }
  ];

  constructor() {
    this.customersSubject.next(this.customers);
    this.transactionsSubject.next(this.transactions);
    this.loansSubject.next(this.loans);
  }

  getCustomers(bankId?: string): Observable<Customer[]> {
    let customers = this.customers;
    if (bankId) {
      customers = customers.filter(c => c.bankId === bankId);
    }
    return of(customers);
  }

  createCustomer(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Observable<Customer> {
    const newCustomer: Customer = {
      ...customer,
      id: 'cust-' + (this.customers.length + 1),
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.customers.push(newCustomer);
    this.customersSubject.next(this.customers);
    return of(newCustomer);
  }

  updateCustomer(id: string, updates: Partial<Customer>): Observable<Customer | undefined> {
    const index = this.customers.findIndex(c => c.id === id);
    if (index !== -1) {
      this.customers[index] = { ...this.customers[index], ...updates, updatedAt: new Date() };
      this.customersSubject.next(this.customers);
      return of(this.customers[index]);
    }
    return of(undefined);
  }

  deleteCustomer(id: string): Observable<boolean> {
    const index = this.customers.findIndex(c => c.id === id);
    if (index !== -1) {
      this.customers.splice(index, 1);
      this.customersSubject.next(this.customers);
      return of(true);
    }
    return of(false);
  }

  getTransactions(bankId?: string): Observable<Transaction[]> {
    let transactions = this.transactions;
    if (bankId) {
      transactions = transactions.filter(t => t.bankId === bankId);
    }
    return of(transactions);
  }

  createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt' | 'reference'>): Observable<Transaction> {
    const newTransaction: Transaction = {
      ...transaction,
      id: 'txn-' + (this.transactions.length + 1),
      reference: 'TXN-' + new Date().getFullYear() + '-' + String(this.transactions.length + 1).padStart(3, '0'),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.transactions.push(newTransaction);
    this.transactionsSubject.next(this.transactions);
    return of(newTransaction);
  }

  getLoans(bankId?: string): Observable<Loan[]> {
    let loans = this.loans;
    if (bankId) {
      loans = loans.filter(l => l.bankId === bankId);
    }
    return of(loans);
  }

  updateLoanStatus(id: string, status: Loan['status']): Observable<Loan | undefined> {
    const index = this.loans.findIndex(l => l.id === id);
    if (index !== -1) {
      const updates: Partial<Loan> = { status };
      
      if (status === 'approved') {
        updates.approvedAt = new Date();
      } else if (status === 'disbursed') {
        updates.disbursedAt = new Date();
      }
      
      this.loans[index] = { ...this.loans[index], ...updates };
      this.loansSubject.next(this.loans);
      return of(this.loans[index]);
    }
    return of(undefined);
  }

  getDashboardStats(bankId?: string): Observable<DashboardStats> {
    const customers = bankId ? this.customers.filter(c => c.bankId === bankId) : this.customers;
    const transactions = bankId ? this.transactions.filter(t => t.bankId === bankId) : this.transactions;
    const loans = bankId ? this.loans.filter(l => l.bankId === bankId) : this.loans;

    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const dailyTransactions = transactions.filter(t => t.createdAt >= startOfDay).length;

    const stats: DashboardStats = {
      totalCustomers: customers.length,
      totalTransactions: transactions.length,
      totalLoans: loans.length,
      totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
      dailyTransactions,
      pendingLoans: loans.filter(l => l.status === 'pending').length,
      activeCustomers: customers.filter(c => c.status === 'active').length,
      monthlyRevenue: transactions.filter(t => t.createdAt.getMonth() === today.getMonth()).reduce((sum, t) => sum + (t.amount * 0.01), 0)
    };

    return of(stats);
  }
}