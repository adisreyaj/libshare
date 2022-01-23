import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { List } from '../interfaces/list.interface';
import { IconModule } from '../icon.module';
import { ButtonModule, DropdownModule, TooltipModule } from 'zigzag';

@Component({
  selector: 'app-list-card',
  template: `
    <li class="list-card relative border border-slate-200 flex flex-col p-4 bg-white rounded-md hover:shadow-lg">
      <div class="absolute z-10 top-2 right-2">
        <div *ngIf="!list.public">
          <rmx-icon name="lock-line" class="icon-sm" zzTooltip="Only visible to you"></rmx-icon>
        </div>
      </div>
      <header class="mb-4 relative">
        <p class="font-medium text-slate-900 line-clamp-1">{{ list.name }}</p>
        <p class="text-slate-500 text-sm line-clamp-2" [style.min-height.px]="40">{{ list.description }}</p>
      </header>
      <div>
        <h4 class="text-sm">
          Libraries <span class="text-sm text-slate-600">({{ list.libraries.length }})</span>
        </h4>
        <ul class="flex gap-4 mt-2">
          <li *ngFor="let library of list.libraries | slice: 0:3">
            <header class="flex flex-col justify-center items-center">
              <img [src]="library.image" class="rounded-full w-10 h-10" />
              <p class="text-sm">{{ library.name }}</p>
            </header>
          </li>
        </ul>
      </div>
      <footer class="flex items-center justify-between pt-3 mt-3 border-t border-slate-200">
        <div class="flex items-center">
          <rmx-icon name="time-line" class="mr-1 text-gray-500 icon-xs"></rmx-icon>
          <p class="text-xs text-gray-500">{{ list.createdAt | date: 'MMM d' }}</p>
        </div>
        <div class="flex items-center">
          <div class="relative dropdown"></div>
          <a zzButton variant="primary" size="sm" target="_blank" rel="noopener noreferrer">View</a>
          <button zzButton size="sm" [zzDropdownTrigger]="moreOptions" placement="bottom-start" class="ml-2">
            More
            <zz-dropdown #moreOptions>
              <li zzDropdownItem zzDropdownCloseOnClick (click)="edit.emit(list)">Edit</li>
              <li zzDropdownItem zzDropdownCloseOnClick>Share</li>
              <li zzDropdownItem zzDropdownCloseOnClick>Copy Public Link</li>
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
}

@NgModule({
  imports: [CommonModule, IconModule, ButtonModule, DropdownModule, TooltipModule],
  declarations: [ListCardComponent],
  exports: [ListCardComponent],
})
export class ListCardModule {}
