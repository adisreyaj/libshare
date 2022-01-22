import { Component, Input, NgModule } from '@angular/core';
import { Library } from '../interfaces/library.interface';
import { CommonModule } from '@angular/common';
import { CountPipeModule } from '../pipes/count.pipe';
import { IconModule } from '../icon.module';
import { ButtonModule } from 'zigzag';

@Component({
  selector: 'app-library-card',
  template: `
    <div class="relative flex flex-col p-2 bg-white rounded-md shadow-md hover:shadow-lg" *ngIf="library">
      <button
        class="absolute p-1 bg-white rounded-lg cursor-pointer focus:outline-none"
        style="top: 2px;right: 2px;"
        tippy="Toggle Favorite"
        aria-label="Toggle favorite"
      >
        <rmx-icon
          [name]="true ? 'star-fill' : 'star-line'"
          class="text-gray-500 icon-md"
          [class.text-primary]="true"
        ></rmx-icon>
      </button>
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
      <footer class="flex items-center justify-between pb-1 mt-3">
        <div class="flex items-center">
          <rmx-icon name="time-line" class="mr-1 text-gray-500icon-xs"></rmx-icon>
          <p class="text-xs text-gray-500">Date</p>
        </div>
        <div class="flex items-center">
          <div class="relative dropdown"></div>
          <button zzButton size="sm" class="mr-2">More</button>
          <!--          <a zzButton size="sm" target="_blank" [href]="library.links.homepage" rel="noopener noreferrer">View</a>-->
        </div>
      </footer>
    </div>

    <ng-template #repoDetails let-library>
      <div class="flex items-center justify-between pb-2 mb-3 text-xs text-gray-400 border-b">
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
                {{ library?.metadata?.license }}
              </p>
              <a
                target="_blank"
                rel="noopener noreferrer"
                [href]="'https://choosealicense.com/licenses/' + (library?.metadata?.license | lowercase)"
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
}

@NgModule({
  declarations: [LibraryCardComponent],
  exports: [LibraryCardComponent],
  imports: [CommonModule, CountPipeModule, IconModule, ButtonModule],
})
export class LibraryCardModule {}
