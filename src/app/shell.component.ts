import { Component, NgModule } from '@angular/core';
import { HeaderModule } from './components/header.component';
import { RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-shell',
  template: `
    <app-header (logout)="logout()"></app-header>
    <main class="box">
      <router-outlet></router-outlet>
    </main>
  `,
})
export class ShellComponent {
  constructor(private readonly auth: AuthService) {}

  logout() {
    this.auth.logout();
  }
}

@NgModule({
  declarations: [ShellComponent],
  exports: [ShellComponent],
  imports: [HeaderModule, RouterModule],
})
export class ShellModule {}
