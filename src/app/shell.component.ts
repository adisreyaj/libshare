import { Component, NgModule } from '@angular/core';
import { HeaderModule } from './components/header.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-shell',
  template: `
    <app-header></app-header>
    <main class="box">
      <router-outlet></router-outlet>
    </main>
  `,
})
export class ShellComponent {}

@NgModule({
  declarations: [ShellComponent],
  exports: [ShellComponent],
  imports: [HeaderModule, RouterModule],
})
export class ShellModule {}
