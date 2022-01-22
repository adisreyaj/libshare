import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  template: `
    <header class="mt-4">
      <div class="box header h-full flex items-center gap-8 box">
        <h1 routerLink="/">Lib Share</h1>
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
        @apply bg-white border rounded-lg border-slate-300 text-slate-700;
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
