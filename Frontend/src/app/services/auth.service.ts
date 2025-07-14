import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, Bank } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private banks: Bank[] = [
    {
      id: 'bank-abc',
      name: 'First National Bank',
      code: 'FNB',
      adminId: 'admin-abc',
      address: '123 Financial District, New York, NY 10005',
      phone: '+1 (555) 123-4567',
      email: 'admin@firstnational.com',
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 'bank-xyz',
      name: 'Metropolitan Trust Bank',
      code: 'MTB',
      adminId: 'admin-xyz',
      address: '456 Commerce Avenue, Chicago, IL 60601',
      phone: '+1 (555) 987-6543',
      email: 'admin@metrotrust.com',
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date('2024-01-01')
    }
  ];

  private users: User[] = [
    {
      id: 'super-admin',
      name: 'System Administrator',
      email: 'admin@bankingsystem.com',
      role: 'super-admin',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1&fit=crop',
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 'admin-abc',
      name: 'Robert Johnson',
      email: 'robert.johnson@firstnational.com',
      role: 'bank-admin',
      bankId: 'bank-abc',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1&fit=crop',
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 'admin-xyz',
      name: 'Sarah Williams',
      email: 'sarah.williams@metrotrust.com',
      role: 'bank-admin',
      bankId: 'bank-xyz',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1&fit=crop',
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date('2024-01-01')
    }
  ];

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    } else {
      // Auto-login as super admin for demo
      this.login('admin@bankingsystem.com', 'admin123');
    }
  }

  login(email: string, password: string): boolean {
    const user = this.users.find(u => u.email === email);
    if (user && password === 'admin123') {
      this.currentUserSubject.next(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getBanks(): Bank[] {
    return this.banks;
  }

  getBankById(id: string): Bank | undefined {
    return this.banks.find(b => b.id === id);
  }

  isSuperAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'super-admin';
  }

  isBankAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'bank-admin';
  }

  getCurrentUserBank(): Bank | undefined {
    const user = this.getCurrentUser();
    if (user?.bankId) {
      return this.getBankById(user.bankId);
    }
    return undefined;
  }

  switchUser(userId: string): void {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      this.currentUserSubject.next(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  }
}