import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { List } from '../interfaces/list.interface';
import { IconModule } from '../icon.module';
import { ButtonModule, ClipboardDirectiveModule, DropdownModule, TooltipModule } from 'zigzag';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-list-card',
  template: `
    <li class="list-card relative flex flex-col rounded-md border border-slate-200 bg-white p-4 hover:shadow-lg">
      <div class="absolute top-2 right-2 z-10">
        <div *ngIf="!list.public">
          <rmx-icon name="lock-line" class="icon-sm" zzTooltip="Only visible to you"></rmx-icon>
        </div>
      </div>
      <header class="relative mb-4">
        <p class="font-medium text-slate-900 line-clamp-1">{{ list.name }}</p>
        <p class="text-sm text-slate-500 line-clamp-2" [style.min-height.px]="40">{{ list.description }}</p>
      </header>
      <div>
        <h4 class="text-sm">
          Libraries <span class="text-sm text-slate-600">({{ list.libraries.length }})</span>
        </h4>
        <ul class="mt-2 flex gap-4">
          <li *ngFor="let library of list.libraries | slice: 0:3">
            <header class="flex flex-col items-center justify-center">
              <img [src]="library.image" class="h-10 w-10 rounded-full" />
              <p class="text-sm">{{ library.name }}</p>
            </header>
          </li>
        </ul>
      </div>
      <footer class="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">
        <div class="flex items-center">
          <rmx-icon name="time-line" class="icon-xs mr-1 text-gray-500"></rmx-icon>
          <p class="text-xs text-gray-500">{{ list.createdAt | date: 'MMM d' }}</p>
        </div>
        <div class="flex items-center">
          <div class="dropdown relative"></div>
          <a zzButton variant="primary" size="sm" rel="noopener noreferrer" [routerLink]="['/lists', list.id]">View</a>
          <button zzButton size="sm" [zzDropdownTrigger]="moreOptions" placement="bottom-start" class="ml-2">
            More
            <zz-dropdown #moreOptions>
              <li zzDropdownItem zzDropdownCloseOnClick (click)="edit.emit(list)">Edit</li>
              <li
                zzDropdownItem
                zzDropdownCloseOnClick
                *ngIf="list.public"
                [zzClipboard]="origin + '/view/' + list.slug"
              >
                Copy Public Link
              </li>
              <li zzDropdownItem class="text-red-600" zzDropdownCloseOnClick (click)="delete.emit(list)">Delete</li>
            </zz-dropdown>
          </button>
        </div>
      </footer>
    </li>
  `,
})
export class ListCardComponent {
  @Input()
  list!: List;
  @Output()
  edit = new EventEmitter<List>();

  @Output()
  delete = new EventEmitter<List>();

  readonly origin = location.origin;
}

@NgModule({
  imports: [
    CommonModule,
    IconModule,
    ButtonModule,
    DropdownModule,
    TooltipModule,
    ClipboardDirectiveModule,
    RouterModule,
  ],
  declarations: [ListCardComponent],
  exports: [ListCardComponent],
})
export class ListCardModule {}
