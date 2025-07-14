import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HSMKey, ATMDevice } from '../../models/user.model';

@Component({
  selector: 'app-hsm',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">HSM & Key Management</h1>
          <p class="text-gray-600">Manage cryptographic keys and HSM operations</p>
        </div>
        <div class="flex space-x-3">
          <button
            (click)="openCreateKeyModal()"
            class="btn btn-primary"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
            </svg>
            Generate Key
          </button>
          <button
            (click)="openSendKeyModal()"
            class="btn btn-secondary"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
            Send Key to ATM
          </button>
        </div>
      </div>

      <!-- HSM Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="stats-card bg-blue-600">
          <h3>{{ getActiveKeysCount() }}</h3>
          <p>Active Keys</p>
        </div>

        <div class="stats-card bg-green-600">
          <h3>{{ getTotalKeys() }}</h3>
          <p>Total Keys</p>
        </div>

        <div class="stats-card bg-yellow-600">
          <h3>{{ getExpiringKeys() }}</h3>
          <p>Expiring Soon</p>
        </div>

        <div class="stats-card bg-red-600">
          <h3>{{ getRevokedKeys() }}</h3>
          <p>Revoked Keys</p>
        </div>
      </div>

      <!-- Keys Table -->
      <div class="card" style="overflow-x:auto; padding-right:2rem;">
        <div class="card-body">
          <table class="table" style="min-width:1200px;">
            <thead>
              <tr>
                <th>Key Name</th>
                <th>Key Type</th>
                <th>Length</th>
                <th>ATM Assignment</th>
                <th>Status</th>
                <th>Created</th>
                <th>Expires</th>
                <th>Usage Count</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let key of hsmKeys">
                <td>
                  <div>
                    <p class="font-medium">{{ key.keyName }}</p>
                    <p class="text-sm text-gray-600">{{ key.id }}</p>
                  </div>
                </td>
                <td>
                  <span class="badge badge-info">{{ key.keyType }}</span>
                </td>
                <td>{{ key.keyLength }} bits</td>
                <td>
                  <span *ngIf="key.atmId" class="font-mono text-sm">{{ getATMName(key.atmId) }}</span>
                  <span *ngIf="!key.atmId" class="text-gray-500">Unassigned</span>
                </td>
                <td>
                  <span
                    class="badge"
                    [class]="getStatusBadgeClass(key.status)"
                  >
                    {{ key.status | titlecase }}
                  </span>
                </td>
                <td>{{ key.createdAt | date:'short' }}</td>
                <td>
                  <span [class]="isExpiringSoon(key.expiryDate) ? 'text-red-600 font-semibold' : ''">
                    {{ key.expiryDate | date:'short' }}
                  </span>
                </td>
                <td>{{ key.usageCount }}</td>
                <td style="padding-right:1.5rem;">
                  <div class="flex space-x-2 flex-wrap md:flex-nowrap">
                    <button
                      (click)="sendKeyToATM(key)"
                      class="btn btn-sm btn-primary"
                      [disabled]="key.status !== 'active'"
                    >
                      Send
                    </button>
                    <button
                      (click)="revokeKey(key.id)"
                      class="btn btn-sm btn-error"
                      [disabled]="key.status === 'revoked'"
                    >
                      Revoke
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Generate Key Modal -->
    <div *ngIf="showCreateKeyModal" class="modal-overlay" (click)="closeCreateKeyModal()">
      <div class="hsm-modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div class="modal-title-section">
            <div class="modal-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
              </svg>
            </div>
            <div>
              <h3 class="modal-title">Generate New Cryptographic Key</h3>
              <p class="modal-subtitle">Create a new key for secure operations</p>
            </div>
          </div>
          <button (click)="closeCreateKeyModal()" class="modal-close-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <form (ngSubmit)="generateKey()" #keyForm="ngForm">
            <div class="form-grid">
              <div class="form-section">
                <h4 class="section-title">Key Configuration</h4>
                <div class="section-grid">
                  <div class="form-group">
                    <label class="form-label">
                      <span class="label-text">Key Name</span>
                      <span class="label-required">*</span>
                    </label>
                    <input
                      type="text"
                      class="form-input"
                      [(ngModel)]="keyData.keyName"
                      name="keyName"
                      placeholder="Enter key name"
                      required
                    >
                  </div>

                  <div class="form-group">
                    <label class="form-label">
                      <span class="label-text">Key Type</span>
                      <span class="label-required">*</span>
                    </label>
                    <select
                      class="form-select"
                      [(ngModel)]="keyData.keyType"
                      name="keyType"
                      (change)="onKeyTypeChange()"
                      required
                    >
                      <option value="">Select Key Type</option>
                      <option value="AES">AES (Advanced Encryption Standard)</option>
                      <option value="RSA">RSA (Rivest-Shamir-Adleman)</option>
                      <option value="DES">DES (Data Encryption Standard)</option>
                      <option value="3DES">3DES (Triple DES)</option>
                      <option value="PIN">PIN Verification Key</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label">
                      <span class="label-text">Key Length</span>
                      <span class="label-required">*</span>
                    </label>
                    <select
                      class="form-select"
                      [(ngModel)]="keyData.keyLength"
                      name="keyLength"
                      required
                    >
                      <option *ngFor="let length of getAvailableKeyLengths()" [value]="length">
                        {{ length }} bits
                      </option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label">
                      <span class="label-text">Expiry Date</span>
                      <span class="label-required">*</span>
                    </label>
                    <input
                      type="date"
                      class="form-input"
                      [(ngModel)]="keyData.expiryDate"
                      name="expiryDate"
                      [min]="getTomorrowDate()"
                      required
                    >
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" (click)="closeCreateKeyModal()" class="btn btn-secondary">
                Cancel
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                [disabled]="!keyForm.valid"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z"/>
                </svg>
                Generate Key
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Send Key to ATM Modal -->
    <div *ngIf="showSendKeyModal" class="modal-overlay" (click)="closeSendKeyModal()">
      <div class="hsm-modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div class="modal-title-section">
            <div class="modal-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
            </div>
            <div>
              <h3 class="modal-title">Send Key to ATM</h3>
              <p class="modal-subtitle">Deploy cryptographic key to ATM device</p>
            </div>
          </div>
          <button (click)="closeSendKeyModal()" class="modal-close-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <form (ngSubmit)="sendKey()" #sendKeyForm="ngForm">
            <div class="form-grid">
              <div class="form-section">
                <h4 class="section-title">Key Deployment</h4>
                <div class="section-grid">
                  <div class="form-group">
                    <label class="form-label">
                      <span class="label-text">Select Key</span>
                      <span class="label-required">*</span>
                    </label>
                    <select
                      class="form-select"
                      [(ngModel)]="sendKeyData.keyId"
                      name="keyId"
                      required
                    >
                      <option value="">Select Key</option>
                      <option *ngFor="let key of getActiveKeys()" [value]="key.id">
                        {{ key.keyName }} ({{ key.keyType }})
                      </option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label">
                      <span class="label-text">Target ATM</span>
                      <span class="label-required">*</span>
                    </label>
                    <select
                      class="form-select"
                      [(ngModel)]="sendKeyData.atmId"
                      name="atmId"
                      required
                    >
                      <option value="">Select ATM</option>
                      <option *ngFor="let atm of atmDevices" [value]="atm.id">
                        {{ atm.atmId }} - {{ atm.location }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" (click)="closeSendKeyModal()" class="btn btn-secondary">
                Cancel
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                [disabled]="!sendKeyForm.valid"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
                Send Key
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

    .space-x-3 > * + * {
      margin-left: 0.75rem;
    }

    .hsm-modal {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      width: 90vw;
      max-width: 700px;
      max-height: 90vh;
      overflow-x: auto;
      overflow-y: auto;
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

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      padding: 2rem;
      border-top: 1px solid #f1f5f9;
      background: #f8fafc;
      flex-wrap: wrap;
    }

    @media (max-width: 768px) {
      .hsm-modal {
        width: 98vw;
        max-width: 100vw;
        max-height: 98vh;
      }
      .modal-header,
      .modal-body,
      .modal-footer {
        padding: 1rem;
      }
      .modal-footer {
        flex-direction: column-reverse;
        gap: 0.5rem;
      }
      .modal-footer .btn {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class HsmComponent implements OnInit {
  hsmKeys: HSMKey[] = [];
  atmDevices: ATMDevice[] = [];
  showCreateKeyModal = false;
  showSendKeyModal = false;

  keyData = {
    keyName: '',
    keyType: '' as HSMKey['keyType'],
    keyLength: 256,
    expiryDate: ''
  };

  sendKeyData = {
    keyId: '',
    atmId: ''
  };

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.loadHSMKeys();
    this.loadATMDevices();
  }

  loadHSMKeys() {
    // Mock data for demonstration
    this.hsmKeys = [
      {
        id: 'key-1',
        keyName: 'ATM_PIN_VERIFICATION_KEY',
        keyType: 'PIN',
        keyLength: 128,
        bankId: 'bank-abc',
        atmId: 'atm-1',
        status: 'active',
        createdAt: new Date('2024-01-01'),
        expiryDate: new Date('2024-12-31'),
        lastUsed: new Date('2024-01-15'),
        usageCount: 1250
      },
      {
        id: 'key-2',
        keyName: 'TRANSACTION_ENCRYPTION_KEY',
        keyType: 'AES',
        keyLength: 256,
        bankId: 'bank-abc',
        status: 'active',
        createdAt: new Date('2024-01-05'),
        expiryDate: new Date('2024-06-30'),
        usageCount: 850
      },
      {
        id: 'key-3',
        keyName: 'RSA_SIGNATURE_KEY',
        keyType: 'RSA',
        keyLength: 2048,
        bankId: 'bank-abc',
        status: 'expired',
        createdAt: new Date('2023-06-01'),
        expiryDate: new Date('2024-01-01'),
        usageCount: 2100
      }
    ];
  }

  loadATMDevices() {
    // Mock ATM data
    this.atmDevices = [
      {
        id: 'atm-1',
        atmId: 'ATM001',
        location: 'Main Branch',
        address: '123 Financial District',
        bankId: 'bank-abc',
        status: 'active',
        cashBalance: 50000,
        lastMaintenance: new Date(),
        installationDate: new Date(),
        model: 'NCR SelfServ 88',
        serialNumber: 'NCR88001',
        ipAddress: '192.168.1.101',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  getActiveKeys(): HSMKey[] {
    return this.hsmKeys.filter(key => key.status === 'active');
  }

  getActiveKeysCount(): number {
    return this.getActiveKeys().length;
  }

  getTotalKeys(): number {
    return this.hsmKeys.length;
  }

  getExpiringKeys(): number {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return this.hsmKeys.filter(key =>
      key.status === 'active' && key.expiryDate <= thirtyDaysFromNow
    ).length;
  }

  getRevokedKeys(): number {
    return this.hsmKeys.filter(key => key.status === 'revoked').length;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'active':
        return 'badge-success';
      case 'inactive':
        return 'badge-warning';
      case 'expired':
        return 'badge-error';
      case 'revoked':
        return 'badge-error';
      default:
        return 'badge-info';
    }
  }

  getATMName(atmId: string): string {
    const atm = this.atmDevices.find(a => a.id === atmId);
    return atm ? atm.atmId : 'Unknown ATM';
  }

  isExpiringSoon(expiryDate: Date): boolean {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiryDate <= thirtyDaysFromNow;
  }

  openCreateKeyModal() {
    this.keyData = {
      keyName: '',
      keyType: '' as HSMKey['keyType'],
      keyLength: 256,
      expiryDate: ''
    };
    this.showCreateKeyModal = true;
  }

  openSendKeyModal() {
    this.sendKeyData = {
      keyId: '',
      atmId: ''
    };
    this.showSendKeyModal = true;
  }

  onKeyTypeChange() {
    // Set default key lengths based on key type
    const defaultLengths: { [key: string]: number } = {
      'AES': 256,
      'RSA': 2048,
      'DES': 64,
      '3DES': 192,
      'PIN': 128
    };
    this.keyData.keyLength = defaultLengths[this.keyData.keyType] || 256;
  }

  getAvailableKeyLengths(): number[] {
    switch (this.keyData.keyType) {
      case 'AES':
        return [128, 192, 256];
      case 'RSA':
        return [1024, 2048, 4096];
      case 'DES':
        return [64];
      case '3DES':
        return [112, 168, 192];
      case 'PIN':
        return [64, 128, 256];
      default:
        return [128, 256, 512];
    }
  }

  getTomorrowDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  generateKey() {
    const newKey: HSMKey = {
      id: 'key-' + (this.hsmKeys.length + 1),
      keyName: this.keyData.keyName,
      keyType: this.keyData.keyType,
      keyLength: this.keyData.keyLength,
      bankId: this.authService.getCurrentUser()?.bankId || 'bank-abc',
      status: 'active',
      createdAt: new Date(),
      expiryDate: new Date(this.keyData.expiryDate),
      usageCount: 0
    };

    this.hsmKeys.push(newKey);
    this.closeCreateKeyModal();
    alert('Key generated successfully!');
  }

  sendKey() {
    const key = this.hsmKeys.find(k => k.id === this.sendKeyData.keyId);
    const atm = this.atmDevices.find(a => a.id === this.sendKeyData.atmId);

    if (key && atm) {
      // Update key with ATM assignment
      key.atmId = this.sendKeyData.atmId;
      key.usageCount++;

      this.closeSendKeyModal();
      alert(`Key "${key.keyName}" sent successfully to ATM ${atm.atmId}!`);
    }
  }

  sendKeyToATM(key: HSMKey) {
    this.sendKeyData.keyId = key.id;
    this.openSendKeyModal();
  }

  revokeKey(keyId: string) {
    if (confirm('Are you sure you want to revoke this key? This action cannot be undone.')) {
      const key = this.hsmKeys.find(k => k.id === keyId);
      if (key) {
        key.status = 'revoked';
        alert('Key revoked successfully!');
      }
    }
  }

  closeCreateKeyModal() {
    this.showCreateKeyModal = false;
  }

  closeSendKeyModal() {
    this.showSendKeyModal = false;
  }
}