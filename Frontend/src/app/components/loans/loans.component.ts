import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { Loan } from '../../models/user.model';

@Component({
  selector: 'app-loans',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Loans</h1>
          <p class="text-gray-600">Manage loan applications</p>
        </div>
      </div>
      
      <div class="card">
        <div class="card-body">
          <div class="overflow-x-auto">
            <table class="table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Loan Type</th>
                  <th>Amount</th>
                  <th>Interest Rate</th>
                  <th>Term</th>
                  <th>Status</th>
                  <th>Applied Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let loan of loans">
                  <td>
                    <div>
                      <p class="font-medium">{{ loan.customerName }}</p>
                      <p class="text-sm text-gray-600">ID: {{ loan.customerId }}</p>
                    </div>
                  </td>
                  <td>
                    <span class="badge badge-info">{{ loan.loanType | titlecase }}</span>
                  </td>
                  <td class="font-semibold">
                    \${{ loan.amount | number:'1.2-2' }}
                  </td>
                  <td>{{ loan.interestRate }}%</td>
                  <td>{{ loan.term }} months</td>
                  <td>
                    <span 
                      class="badge"
                      [class]="getStatusBadgeClass(loan.status)"
                    >
                      {{ loan.status | titlecase }}
                    </span>
                  </td>
                  <td>{{ loan.appliedAt | date:'short' }}</td>
                  <td>
                    <div class="flex space-x-2" *ngIf="loan.status === 'pending'">
                      <button 
                        (click)="approveLoan(loan.id)" 
                        class="btn btn-sm btn-success"
                      >
                        Approve
                      </button>
                      <button 
                        (click)="rejectLoan(loan.id)" 
                        class="btn btn-sm btn-error"
                      >
                        Reject
                      </button>
                    </div>
                    <div *ngIf="loan.status === 'approved'" class="flex space-x-2">
                      <button 
                        (click)="disburseLoan(loan.id)" 
                        class="btn btn-sm btn-primary"
                      >
                        Disburse
                      </button>
                    </div>
                    <span *ngIf="loan.status === 'rejected' || loan.status === 'disbursed'" class="text-gray-500">
                      {{ loan.status === 'rejected' ? 'Rejected' : 'Disbursed' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
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
export class LoansComponent implements OnInit {
  loans: Loan[] = [];

  constructor(
    private dataService: DataService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.loadLoans();
  }

  loadLoans() {
    const bankId = this.authService.isBankAdmin() ? this.authService.getCurrentUser()?.bankId : undefined;
    
    this.dataService.getLoans(bankId).subscribe(loans => {
      this.loans = loans;
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'approved':
        return 'badge-success';
      case 'pending':
        return 'badge-warning';
      case 'rejected':
        return 'badge-error';
      case 'disbursed':
        return 'badge-info';
      default:
        return 'badge-info';
    }
  }

  approveLoan(loanId: string) {
    this.dataService.updateLoanStatus(loanId, 'approved').subscribe(() => {
      this.loadLoans();
    });
  }

  rejectLoan(loanId: string) {
    if (confirm('Are you sure you want to reject this loan?')) {
      this.dataService.updateLoanStatus(loanId, 'rejected').subscribe(() => {
        this.loadLoans();
      });
    }
  }

  disburseLoan(loanId: string) {
    if (confirm('Are you sure you want to disburse this loan?')) {
      this.dataService.updateLoanStatus(loanId, 'disbursed').subscribe(() => {
        this.loadLoans();
      });
    }
  }
}