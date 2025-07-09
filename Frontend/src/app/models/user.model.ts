export interface User {
  id: string;
  name: string;
  email: string;
  role: 'super-admin' | 'bank-admin' | 'customer';
  bankId?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Bank {
  id: string;
  name: string;
  code: string;
  adminId: string;
  address?: string;
  phone?: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  accountNumber: string;
  bankId: string;
  balance: number;
  dateOfBirth: Date;
  occupation: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  fromAccountNumber: string;
  toAccountNumber: string;
  amount: number;
  description: string;
  type: 'credit' | 'debit' | 'transfer';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  bankId: string;
  reference: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Loan {
  id: string;
  customerId: string;
  customerName: string;
  loanType: 'personal' | 'home' | 'business' | 'auto' | 'education';
  amount: number;
  interestRate: number;
  term: number;
  status: 'pending' | 'approved' | 'rejected' | 'disbursed' | 'closed';
  appliedAt: Date;
  approvedAt?: Date;
  disbursedAt?: Date;
  bankId: string;
  monthlyPayment?: number;
}

export interface DashboardStats {
  totalCustomers: number;
  totalTransactions: number;
  totalLoans: number;
  totalAmount: number;
  dailyTransactions: number;
  pendingLoans: number;
  activeCustomers: number;
  monthlyRevenue: number;
}