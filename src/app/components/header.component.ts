import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  template: `
    <header class="bg-white sticky top-0 border-b border-slate-300">
      <div class="box header h-full flex items-center gap-8 box">
        <a routerLink="/" class="flex items-center gap-2">
          <img src="assets/images/logo.svg" alt="Lib Share" [style.height.px]="40" />
        </a>
        <nav>
          <ul class="flex items-center gap-8">
            <li routerLink="/lists">Lists</li>
            <li routerLink="/libraries">Libraries</li>
          </ul>
        </nav>
      </div>
    </header>
  `,
  styles: [
    `
      .header {
        height: 64px;
        @apply text-slate-700;
      }

      nav ul li,
      h1 {
        @apply cursor-pointer;
      }
    `,
  ],
})
export class HeaderComponent {}

@NgModule({
  declarations: [HeaderComponent],
  exports: [HeaderComponent],
  imports: [RouterModule],
})
export class HeaderModule {}
