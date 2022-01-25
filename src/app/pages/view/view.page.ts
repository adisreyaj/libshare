import { Component, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ListPublic } from '../../interfaces/list.interface';
import { Observable, switchMap } from 'rxjs';
import { ListsService } from '../../services/lists.service';
import { LibraryCardModule } from '../../components/library-card.component';

@Component({
  selector: 'app-view',
  template: `
    <div class="box grid h-screen py-4" [style.grid-template-rows]="'250px auto 120px'" *ngIf="list$ | async as list">
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
      </header>
      <div class="mt-10 ">
        <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <ng-container *ngFor="let library of list.libraries">
            <app-library-card [library]="library"></app-library-card>
          </ng-container>
        </section>
      </div>
      <footer class="mt-10 ">
        <div class="flex w-full flex-col items-center justify-center">
          <a routerLink="/" class="flex items-center gap-2">
            <img src="assets/images/logo.svg" alt="Lib Share" [style.height.px]="40" />
            <div>
              <p class="-mb-2 font-heading text-2xl font-semibold">LibShare</p>
              <p class="font-heading text-sm text-slate-400">Curate <span>&</span> Share</p>
            </div>
          </a>
          <div class="mt-4 text-center">
            <p class="text-xs">
              Copyright &copy; 2022 -
              <a
                href="https://libshare.adi.so?ref=footer"
                class="text-sm font-medium decoration-wavy underline-offset-1 hover:underline"
                >LibShare</a
              >&nbsp;&nbsp;|&nbsp;&nbsp;<a
                href="https://github.com/adisreyaj/libshare"
                rel="noopener noreferrer"
                class="text-sm font-medium decoration-wavy underline-offset-1 hover:underline"
                >Github</a
              >
            </p>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [],
})
export class ViewPage implements OnInit {
  list$!: Observable<ListPublic>;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly listsService: ListsService,
    private readonly route: Router,
  ) {}

  ngOnInit() {
    this.list$ = this.activatedRoute.params.pipe(
      switchMap((params) => this.listsService.getListBySlug(params['slug'])),
    );
  }
}

@NgModule({
  declarations: [ViewPage],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ViewPage,
      },
    ]),
    LibraryCardModule,
  ],
  exports: [ViewPage],
})
export class ViewModule {}
