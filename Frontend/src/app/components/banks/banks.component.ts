import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Bank } from '../../models/user.model';

@Component({
  selector: 'app-banks',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Banks</h1>
          <p class="text-gray-600">Manage all banks in the system</p>
        </div>
        <button class="btn btn-primary">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add Bank
        </button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let bank of banks" class="card">
          <div class="card-body">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold">{{ bank.name }}</h3>
              <span class="badge badge-info">{{ bank.code }}</span>
            </div>
            
            <div class="space-y-2 text-sm text-gray-600">
              <p><strong>Admin ID:</strong> {{ bank.adminId }}</p>
              <p><strong>Created:</strong> {{ bank.createdAt | date:'short' }}</p>
              <p><strong>Updated:</strong> {{ bank.updatedAt | date:'short' }}</p>
            </div>
            
            <div class="flex justify-end space-x-2 mt-4">
              <button class="btn btn-sm btn-secondary">Edit</button>
              <button class="btn btn-sm btn-error">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .space-x-2 > * + * {
      margin-left: 0.5rem;
    }
    .space-y-2 > * + * {
      margin-top: 0.5rem;
    }
  `]
})
export class BanksComponent implements OnInit {
  banks: Bank[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.banks = this.authService.getBanks();
  }
}