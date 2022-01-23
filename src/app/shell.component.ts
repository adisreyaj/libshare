import { Component, NgModule, OnDestroy, OnInit } from '@angular/core';
import { HeaderModule } from './components/header.component';
import { RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-shell',
  template: `
    <app-header (logout)="logout()"></app-header>
    <main class="box">
      <router-outlet></router-outlet>
    </main>
  `,
})
export class ShellComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject<void>();

  constructor(private readonly auth: AuthService) {}

  ngOnInit() {
    this.auth.getLoggedInUserDetails().subscribe();
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }

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
