import { Component, EventEmitter, Inject, NgModule, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { USER_DATA } from '../core/tokens/user.token';
import { User } from '../interfaces/user.interface';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { IconModule } from '../icon.module';
import { DropdownModule } from 'zigzag';

const linkClasses = {
  base: 'h-4/5 hover:underline font-medium text-slate-600 rounded-md px-4 grid place-items-center decoration-wavy underline-offset-4 decoration-2 transition-all duration-200',
  active: 'underline text-primary',
};

@Component({
  selector: 'app-header',
  template: `
    <header class="sticky top-0 z-10 border-b border-slate-300 bg-white">
      <div class="box header flex h-full items-center justify-between">
        <div class="flex h-full items-center gap-2 md:gap-8">
          <a routerLink="/" class="flex items-center gap-2">
            <img src="assets/images/logo.svg" alt="Lib Share" [style.height.px]="40" />
            <div class="hidden md:block">
              <p class="-mb-2 font-heading text-2xl font-semibold">LibShare</p>
              <p class="font-heading text-sm text-slate-400">Curate <span>&</span> Share</p>
            </div>
          </a>
          <nav class="h-full">
            <ul class="flex h-full items-center gap-2 md:gap-4">
              <li routerLink="/libraries" routerLinkActive="${linkClasses.active}" class="${linkClasses.base}">
                Libraries
              </li>
              <li routerLink="/lists" routerLinkActive="${linkClasses.active}" class="${linkClasses.base}">Lists</li>
            </ul>
          </nav>
        </div>
        <button
          *ngIf="user$ | async as user"
          class="flex items-center gap-2 rounded-md p-2 hover:bg-slate-100"
          [zzDropdownTrigger]="profileDropdown"
        >
          <img
            [src]="'https://avatar.tobi.sh/' + user.firstName"
            [alt]="user.firstName"
            class="h-10 w-10 rounded-full"
          />
          <div class="hidden flex-col items-start text-sm text-slate-700 md:flex">
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
