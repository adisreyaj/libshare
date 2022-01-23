import { Component, EventEmitter, Inject, NgModule, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { USER_DATA } from '../core/tokens/user.token';
import { User } from '../interfaces/user.interface';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { IconModule } from '../icon.module';
import { DropdownModule } from 'zigzag';

@Component({
  selector: 'app-header',
  template: `
    <header class="bg-white sticky top-0 border-b border-slate-300">
      <div class="box header h-full flex items-center justify-between box">
        <div class="flex items-center gap-8">
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
        <button
          *ngIf="user$ | async as user"
          class="flex items-center gap-2 hover:bg-slate-100 p-2 rounded-md"
          [zzDropdownTrigger]="profileDropdown"
        >
          <img
            [src]="'https://avatar.tobi.sh/' + user.firstName"
            [alt]="user.firstName"
            class="rounded-full w-10 h-10"
          />
          <div class="text-sm flex flex-col items-start text-slate-700">
            <p class="font-medium">{{ user.firstName }}</p>
            <p>{{ user.lastName }}</p>
          </div>
          <rmx-icon name="arrow-down-s-line" class="icon-sm"></rmx-icon>
          <zz-dropdown #profileDropdown>
            <li zzDropdownItem class="text-red-600" (click)="logout.emit()" zzDropdownCloseOnClick>Logout</li>
          </zz-dropdown>
        </button>
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
export class HeaderComponent {
  @Output()
  logout = new EventEmitter<void>();

  constructor(@Inject(USER_DATA) public readonly user$: Observable<User | null>) {}
}

@NgModule({
  declarations: [HeaderComponent],
  exports: [HeaderComponent],
  imports: [RouterModule, CommonModule, IconModule, DropdownModule],
})
export class HeaderModule {}
