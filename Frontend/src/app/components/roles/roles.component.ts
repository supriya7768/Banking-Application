import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Roles & Permissions</h1>
          <p class="text-gray-600">Manage user roles and permissions</p>
        </div>
        <button class="btn btn-primary">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add Role
        </button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="card">
          <div class="card-body">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold">Super Admin</h3>
              <span class="badge badge-error">High Access</span>
            </div>
            
            <div class="space-y-2 text-sm text-gray-600">
              <p><strong>Description:</strong> Full system access</p>
              <p><strong>Users:</strong> 1</p>
              <p><strong>Permissions:</strong></p>
              <ul class="list-disc list-inside ml-4">
                <li>Manage all banks</li>
                <li>View all customers</li>
                <li>Manage all transactions</li>
                <li>Approve/reject loans</li>
                <li>Manage roles</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-body">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold">Bank Admin</h3>
              <span class="badge badge-warning">Medium Access</span>
            </div>
            
            <div class="space-y-2 text-sm text-gray-600">
              <p><strong>Description:</strong> Bank-specific access</p>
              <p><strong>Users:</strong> 2</p>
              <p><strong>Permissions:</strong></p>
              <ul class="list-disc list-inside ml-4">
                <li>Manage bank customers</li>
                <li>View bank transactions</li>
                <li>Approve/reject bank loans</li>
                <li>Generate reports</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-body">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold">Customer</h3>
              <span class="badge badge-info">Low Access</span>
            </div>
            
            <div class="space-y-2 text-sm text-gray-600">
              <p><strong>Description:</strong> Customer portal access</p>
              <p><strong>Users:</strong> 150+</p>
              <p><strong>Permissions:</strong></p>
              <ul class="list-disc list-inside ml-4">
                <li>View account balance</li>
                <li>Make transactions</li>
                <li>Apply for loans</li>
                <li>View transaction history</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .space-y-2 > * + * {
      margin-top: 0.5rem;
    }
  `]
})
export class RolesComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {}
}