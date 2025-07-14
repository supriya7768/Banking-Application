import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ATMDevice } from '../../models/user.model';

@Component({
  selector: 'app-atm',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">ATM Management</h1>
          <p class="text-gray-600">Manage ATM devices and monitor their status</p>
        </div>
        <button
          (click)="openCreateModal()"
          class="btn btn-primary"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add ATM Device
        </button>
      </div>

      <!-- ATM Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="stats-card bg-blue-600">
          <h3>{{ getActiveATMs() }}</h3>
          <p>Active ATMs</p>
        </div>

        <div class="stats-card bg-green-600">
          <h3>{{ getOnlineATMs() }}</h3>
          <p>Online ATMs</p>
        </div>

        <div class="stats-card bg-yellow-600">
          <h3>{{ getMaintenanceATMs() }}</h3>
          <p>Under Maintenance</p>
        </div>

        <div class="stats-card bg-red-600">
          <h3>{{ getOfflineATMs() }}</h3>
          <p>Out of Service</p>
        </div>
      </div>

      <!-- ATM Devices Table -->
      <div class="card" style="overflow-x:auto; padding-right:2rem;">
        <div class="card-body">
          <table class="table" style="min-width:1200px;">
            <thead>
              <tr>
                <th>ATM ID</th>
                <th>Location</th>
                <th>Status</th>
                <th>Cash Balance</th>
                <th>Model</th>
                <th>Last Maintenance</th>
                <th>IP Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let atm of atmDevices">
                <td>
                  <div>
                    <p class="font-medium">{{ atm.atmId }}</p>
                    <p class="text-sm text-gray-600">{{ atm.serialNumber }}</p>
                  </div>
                </td>
                <td>
                  <div>
                    <p class="font-medium">{{ atm.location }}</p>
                    <p class="text-sm text-gray-600">{{ atm.address }}</p>
                  </div>
                </td>
                <td>
                  <span
                    class="badge"
                    [class]="getStatusBadgeClass(atm.status)"
                  >
                    {{ atm.status | titlecase }}
                  </span>
                </td>
                <td class="font-semibold text-green-600">
                  \${{ atm.cashBalance | number:'1.2-2' }}
                </td>
                <td>{{ atm.model }}</td>
                <td>{{ atm.lastMaintenance | date:'short' }}</td>
                <td>
                  <span class="font-mono text-sm">{{ atm.ipAddress }}</span>
                </td>
                <td style="padding-right:1.5rem;">
                  <div class="flex space-x-2 flex-wrap md:flex-nowrap">
                    <button
                      (click)="editATM(atm)"
                      class="btn btn-sm btn-secondary"
                    >
                      Edit
                    </button>
                    <button
                      (click)="viewDetails(atm)"
                      class="btn btn-sm btn-primary"
                    >
                      Details
                    </button>
                    <button
                      (click)="deleteATM(atm.id)"
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

    <!-- Create/Edit ATM Modal -->
    <div *ngIf="showModal" class="modal-overlay" (click)="closeModal()">
      <div class="atm-modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div class="modal-title-section">
            <div class="modal-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>
              </svg>
            </div>
            <div>
              <h3 class="modal-title">{{ editingATM ? 'Edit ATM Device' : 'Add New ATM Device' }}</h3>
              <p class="modal-subtitle">{{ editingATM ? 'Update ATM device information' : 'Register a new ATM device' }}</p>
            </div>
          </div>
          <button (click)="closeModal()" class="modal-close-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <form (ngSubmit)="saveATM()" #atmForm="ngForm">
            <div class="form-grid">
              <!-- Device Information Section -->
              <div class="form-section">
                <h4 class="section-title">Device Information</h4>
                <div class="section-grid">
                  <div class="form-group">
                    <label class="form-label">
                      <span class="label-text">ATM ID</span>
                      <span class="label-required">*</span>
                    </label>
                    <input
                      type="text"
                      class="form-input"
                      [(ngModel)]="atmData.atmId"
                      name="atmId"
                      placeholder="Enter ATM ID"
                      required
                    >
                  </div>

                  <div class="form-group">
                    <label class="form-label">
                      <span class="label-text">Serial Number</span>
                      <span class="label-required">*</span>
                    </label>
                    <input
                      type="text"
                      class="form-input"
                      [(ngModel)]="atmData.serialNumber"
                      name="serialNumber"
                      placeholder="Enter serial number"
                      required
                    >
                  </div>

                  <div class="form-group">
                    <label class="form-label">
                      <span class="label-text">Model</span>
                      <span class="label-required">*</span>
                    </label>
                    <input
                      type="text"
                      class="form-input"
                      [(ngModel)]="atmData.model"
                      name="model"
                      placeholder="Enter ATM model"
                      required
                    >
                  </div>

                  <div class="form-group">
                    <label class="form-label">
                      <span class="label-text">Status</span>
                      <span class="label-required">*</span>
                    </label>
                    <select
                      class="form-select"
                      [(ngModel)]="atmData.status"
                      name="status"
                      required
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="maintenance">Under Maintenance</option>
                      <option value="out-of-service">Out of Service</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Location Information Section -->
              <div class="form-section">
                <h4 class="section-title">Location Information</h4>
                <div class="section-grid">
                  <div class="form-group">
                    <label class="form-label">
                      <span class="label-text">Location Name</span>
                      <span class="label-required">*</span>
                    </label>
                    <input
                      type="text"
                      class="form-input"
                      [(ngModel)]="atmData.location"
                      name="location"
                      placeholder="Enter location name"
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
                      [(ngModel)]="atmData.address"
                      name="address"
                      rows="3"
                      placeholder="Enter full address"
                      required
                    ></textarea>
                  </div>
                </div>
              </div>

              <!-- Technical Information Section -->
              <div class="form-section">
                <h4 class="section-title">Technical Information</h4>
                <div class="section-grid">
                  <div class="form-group">
                    <label class="form-label">
                      <span class="label-text">IP Address</span>
                      <span class="label-required">*</span>
                    </label>
                    <input
                      type="text"
                      class="form-input"
                      [(ngModel)]="atmData.ipAddress"
                      name="ipAddress"
                      placeholder="192.168.1.100"
                      pattern="^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$"
                      required
                    >
                  </div>

                  <div class="form-group">
                    <label class="form-label">
                      <span class="label-text">Cash Balance</span>
                      <span class="label-required">*</span>
                    </label>
                    <div class="input-with-prefix">
                      <span class="input-prefix">$</span>
                      <input
                        type="number"
                        class="form-input"
                        [(ngModel)]="atmData.cashBalance"
                        name="cashBalance"
                        min="0"
                        step="100"
                        placeholder="0.00"
                        required
                      >
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label">
                      <span class="label-text">Installation Date</span>
                      <span class="label-required">*</span>
                    </label>
                    <input
                      type="date"
                      class="form-input"
                      [(ngModel)]="atmData.installationDate"
                      name="installationDate"
                      required
                    >
                  </div>

                  <div class="form-group">
                    <label class="form-label">
                      <span class="label-text">Last Maintenance</span>
                      <span class="label-required">*</span>
                    </label>
                    <input
                      type="date"
                      class="form-input"
                      [(ngModel)]="atmData.lastMaintenance"
                      name="lastMaintenance"
                      required
                    >
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
                [disabled]="!atmForm.valid"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" *ngIf="!editingATM">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" *ngIf="editingATM">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                {{ editingATM ? 'Update ATM' : 'Add ATM Device' }}
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

    .atm-modal {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      width: 90vw;
      max-width: 900px;
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
      .atm-modal {
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

      .table {
        font-size: 0.85rem;
      }
      .card-body {
        padding: 0.5rem;
      }
      .flex.space-x-2 {
        flex-wrap: wrap;
        gap: 0.25rem;
      }
      .btn.btn-sm {
        padding: 0.25rem 0.5rem;
        font-size: 0.85rem;
      }
    }
  `]
})
export class AtmComponent implements OnInit {
  atmDevices: ATMDevice[] = [];
  showModal = false;
  editingATM: ATMDevice | null = null;

  atmData = {
    atmId: '',
    location: '',
    address: '',
    status: 'active' as ATMDevice['status'],
    cashBalance: 0,
    model: '',
    serialNumber: '',
    ipAddress: '',
    installationDate: '',
    lastMaintenance: ''
  };

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.loadATMDevices();
  }

  loadATMDevices() {
    // Mock data for demonstration
    this.atmDevices = [
      {
        id: 'atm-1',
        atmId: 'ATM001',
        location: 'Main Branch',
        address: '123 Financial District, New York, NY 10005',
        bankId: 'bank-abc',
        status: 'active',
        cashBalance: 50000,
        lastMaintenance: new Date('2024-01-10'),
        installationDate: new Date('2022-01-15'),
        model: 'NCR SelfServ 88',
        serialNumber: 'NCR88001',
        ipAddress: '192.168.1.101',
        createdAt: new Date('2022-01-15'),
        updatedAt: new Date('2024-01-10')
      },
      {
        id: 'atm-2',
        atmId: 'ATM002',
        location: 'Shopping Mall',
        address: '456 Commerce Plaza, New York, NY 10001',
        bankId: 'bank-abc',
        status: 'maintenance',
        cashBalance: 25000,
        lastMaintenance: new Date('2024-01-15'),
        installationDate: new Date('2022-03-20'),
        model: 'Diebold Nixdorf DN Series',
        serialNumber: 'DN2024002',
        ipAddress: '192.168.1.102',
        createdAt: new Date('2022-03-20'),
        updatedAt: new Date('2024-01-15')
      }
    ];
  }

  getActiveATMs(): number {
    return this.atmDevices.filter(atm => atm.status === 'active').length;
  }

  getOnlineATMs(): number {
    return this.atmDevices.filter(atm => atm.status === 'active' || atm.status === 'inactive').length;
  }

  getMaintenanceATMs(): number {
    return this.atmDevices.filter(atm => atm.status === 'maintenance').length;
  }

  getOfflineATMs(): number {
    return this.atmDevices.filter(atm => atm.status === 'out-of-service').length;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'active':
        return 'badge-success';
      case 'inactive':
        return 'badge-warning';
      case 'maintenance':
        return 'badge-info';
      case 'out-of-service':
        return 'badge-error';
      default:
        return 'badge-info';
    }
  }

  openCreateModal() {
    this.editingATM = null;
    this.atmData = {
      atmId: '',
      location: '',
      address: '',
      status: 'active',
      cashBalance: 0,
      model: '',
      serialNumber: '',
      ipAddress: '',
      installationDate: '',
      lastMaintenance: ''
    };
    this.showModal = true;
  }

  editATM(atm: ATMDevice) {
    this.editingATM = atm;
    this.atmData = {
      atmId: atm.atmId,
      location: atm.location,
      address: atm.address,
      status: atm.status,
      cashBalance: atm.cashBalance,
      model: atm.model,
      serialNumber: atm.serialNumber,
      ipAddress: atm.ipAddress,
      installationDate: atm.installationDate.toISOString().split('T')[0],
      lastMaintenance: atm.lastMaintenance.toISOString().split('T')[0]
    };
    this.showModal = true;
  }

  saveATM() {
    if (this.editingATM) {
      // Update existing ATM
      const index = this.atmDevices.findIndex(atm => atm.id === this.editingATM!.id);
      if (index !== -1) {
        this.atmDevices[index] = {
          ...this.editingATM,
          ...this.atmData,
          installationDate: new Date(this.atmData.installationDate),
          lastMaintenance: new Date(this.atmData.lastMaintenance),
          updatedAt: new Date()
        };
      }
    } else {
      // Create new ATM
      const newATM: ATMDevice = {
        id: 'atm-' + (this.atmDevices.length + 1),
        ...this.atmData,
        bankId: this.authService.getCurrentUser()?.bankId || 'bank-abc',
        installationDate: new Date(this.atmData.installationDate),
        lastMaintenance: new Date(this.atmData.lastMaintenance),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.atmDevices.push(newATM);
    }
    this.closeModal();
  }

  viewDetails(atm: ATMDevice) {
    alert(`ATM Details:\nID: ${atm.atmId}\nLocation: ${atm.location}\nStatus: ${atm.status}\nCash Balance: $${atm.cashBalance}`);
  }

  deleteATM(id: string) {
    if (confirm('Are you sure you want to delete this ATM device?')) {
      this.atmDevices = this.atmDevices.filter(atm => atm.id !== id);
    }
  }

  closeModal() {
    this.showModal = false;
    this.editingATM = null;
  }
}