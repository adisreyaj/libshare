import { Component, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListPublic } from '../../interfaces/list.interface';
import { LibraryCardModule } from '../../components/library-card.component';

@Component({
  selector: 'app-view-shared',
  template: `
    <header class="mt-8 text-center">
      <h1 class="font-heading text-3xl font-semibold">{{ list.name }}</h1>
      <p class="text-slate-500 line-clamp-3">{{ list.description }}</p>
      <div class="mt-6 flex flex-col items-center justify-center">
        <img
          [src]="'https://avatar.tobi.sh/' + list.user.firstName"
          [alt]="list.user.firstName"
          class="block h-20 w-20 rounded-full"
        />
        <p class="mt-2 text-sm text-slate-400">
          Curated by
          <span class="text-md font-medium text-slate-800">{{ list.user.firstName }} {{ list.user.lastName }}</span>
        </p>
      </div>
      <p class="mt-2 text-xs text-slate-500">
        Last updated on <span class="font-medium text-slate-700">{{ list.updatedAt | date: 'mediumDate' }}</span>
      </p>
    </header>
    <div class="mt-10 ">
      <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <ng-container *ngFor="let library of list.libraries">
          <app-library-card [library]="library" [publicMode]="publicMode"></app-library-card>
        </ng-container>
      </section>
    </div>
  `,
})
export class ViewShareComponent {
  @Input()
  list!: ListPublic;

  @Input()
  publicMode = false;
}

@NgModule({
  imports: [CommonModule, LibraryCardModule],
  declarations: [ViewShareComponent],
  exports: [ViewShareComponent],
})
export class ViewShareModule {}
