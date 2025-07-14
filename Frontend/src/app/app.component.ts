import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <div class="app-layout">
        <app-sidebar class="app-sidebar"></app-sidebar>
        <div class="app-main">
          <app-header class="app-header"></app-header>
          <main class="app-content">
            <router-outlet></router-outlet>
          </main>
          <app-footer class="app-footer"></app-footer>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Banking System';
}