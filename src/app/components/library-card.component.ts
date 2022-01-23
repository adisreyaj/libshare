import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { Library } from '../interfaces/library.interface';
import { CommonModule } from '@angular/common';
import { CountPipeModule } from '../pipes/count.pipe';
import { IconModule } from '../icon.module';
import { ButtonModule, DropdownModule } from 'zigzag';

@Component({
  selector: 'app-library-card',
  template: `
    <div class="relative border border-slate-200 flex flex-col p-3 bg-white rounded-md hover:shadow-lg" *ngIf="library">
      <div class="flex items-center">
        <img
          [src]="library?.github?.image"
          class="w-12 h-12 mr-4 rounded-sm"
          width="48px"
          height="48px"
          [alt]="library?.name"
        />
        <div>
          <p class="text-sm font-semibold line-clamp-1">{{ library?.name }}</p>
          <p class="mb-2 text-sm text-gray-500 line-clamp-2" [style.minHeight.px]="40">
            {{ library?.description }}
          </p>
        </div>
      </div>
      <ng-container *ngTemplateOutlet="repoDetails; context: { $implicit: library }"></ng-container>
      <footer class="flex items-center justify-between pt-3 border-t border-slate-200">
        <div class="flex items-center">
          <rmx-icon name="time-line" class="mr-1 text-gray-500 icon-xs"></rmx-icon>
          <p class="text-xs text-gray-500">{{ library.createdAt | date: 'MMM d' }}</p>
        </div>
        <div class="flex items-center">
          <div class="relative dropdown"></div>

          <a
            zzButton
            variant="primary"
            size="sm"
            target="_blank"
            [href]="library.links.homepage ?? '#'"
            rel="noopener noreferrer"
            >View</a
          >
          <button zzButton size="sm" [zzDropdownTrigger]="libraryMoreOptions" placement="bottom-start" class="ml-2">
            More
            <zz-dropdown #libraryMoreOptions>
              <li zzDropdownItem>
                <a [href]="library.links.repository" target="_blank" rel="noreferrer noopener"> View Repo </a>
              </li>
              <li zzDropdownItem zzDropdownCloseOnClick>Add to List</li>
              <li zzDropdownItem (click)="edit.emit(library)" zzDropdownCloseOnClick>Edit</li>
              <li zzDropdownItem class="text-red-600" (click)="delete.emit(library.id)" zzDropdownCloseOnClick>
                Delete
              </li>
            </zz-dropdown>
          </button>
        </div>
      </footer>
    </div>

    <ng-template #repoDetails let-library>
      <div class="flex items-center justify-between pb-2 text-xs text-gray-400">
        <div class="flex items-center">
          <div class="mr-3">
            <p class="font-semibold text-gray-700 line-clamp-1">
              {{ library.github.stars | shortCount }}
            </p>
            <p>Stars</p>
          </div>
          <div class="mr-3">
            <p class="font-semibold text-gray-700 line-clamp-1">
              {{ library?.npm?.downloadsCount | shortCount }}
            </p>
            <p>Dwnlds</p>
          </div>
          <div class="mr-3">
            <p class="font-semibold text-gray-700 line-clamp-1">{{ library?.github?.forks | shortCount }}</p>
            <p>Forks</p>
          </div>
          <div>
            <div class="flex items-center">
              <p class="mr-1 font-semibold text-gray-700 line-clamp-1">
                {{ library?.license }}
              </p>
              <a
                target="_blank"
                rel="noopener noreferrer"
                [href]="'https://choosealicense.com/licenses/' + (library?.license | lowercase)"
                aria-label="License details"
              >
                <rmx-icon name="share-box-line" class="icon-xxs text-primary"></rmx-icon>
              </a>
            </div>
            <p>License</p>
          </div>
        </div>
      </div>
    </ng-template>
  `,
})
export class LibraryCardComponent {
  @Input()
  library: Library | null = null;

  @Output()
  edit = new EventEmitter<Library>();

  @Output()
  delete = new EventEmitter<string>();
}

@NgModule({
  declarations: [LibraryCardComponent],
  exports: [LibraryCardComponent],
  imports: [CommonModule, CountPipeModule, IconModule, ButtonModule, DropdownModule],
})
export class LibraryCardModule {}
