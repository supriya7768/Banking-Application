import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { User, Bank } from '../../../models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;
  currentBank: Bank | undefined;
  showProfileMenu = false;
  showUserSwitcher = false;

  users = [
    { id: 'super-admin', name: 'System Administrator', role: 'Super Admin' },
    { id: 'admin-abc', name: 'Robert Johnson', role: 'FNB Admin' },
    { id: 'admin-xyz', name: 'Sarah Williams', role: 'MTB Admin' }
  ];

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.currentBank = this.authService.getCurrentUserBank();
    });
  }

  getBankTitle(): string {
    if (this.authService.isSuperAdmin()) {
      return 'Banking System - Central Administration';
    } else if (this.currentBank) {
      return `${this.currentBank.name} - Administrative Portal`;
    }
    return 'Banking System';
  }

  getRoleDisplayName(): string {
    switch (this.currentUser?.role) {
      case 'super-admin':
        return 'System Administrator';
      case 'bank-admin':
        return 'Bank Administrator';
      case 'customer':
        return 'Customer';
      default:
        return 'User';
    }
  }

  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
    this.showUserSwitcher = false;
  }

  toggleUserSwitcher(): void {
    this.showUserSwitcher = !this.showUserSwitcher;
    this.showProfileMenu = false;
  }

  switchUser(userId: string): void {
    this.authService.switchUser(userId);
    this.showUserSwitcher = false;
  }

  logout(): void {
    this.authService.logout();
    this.showProfileMenu = false;
  }

  closeMenus(): void {
    this.showProfileMenu = false;
    this.showUserSwitcher = false;
  }
}