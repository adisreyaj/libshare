import { Component, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ListPublic } from '../../interfaces/list.interface';
import { Observable, switchMap } from 'rxjs';
import { ListsService } from '../../services/lists.service';
import { LibraryCardModule } from '../../components/library-card.component';
import { ViewShareModule } from './view-share.component';

@Component({
  selector: 'app-view',
  template: `
    <div class="py-4" *ngIf="list$ | async as list">
      <app-view-shared [list]="list" [publicMode]="true"></app-view-shared>
      <footer class="mt-10">
        <div class="flex w-full flex-col items-center justify-center">
          <a routerLink="/" class="flex items-center gap-2">
            <img src="assets/images/logo.svg" alt="Lib Share" [style.height.px]="40" />
            <div>
              <p class="-mb-2 font-heading text-2xl font-semibold">LibShare</p>
              <p class="font-heading text-sm text-slate-400">Curate <span>&</span> Share</p>
            </div>
          </a>
          <div class="my-4 text-center">
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
      switchMap((params) => this.listsService.getListBySlugPublic(params['slug'])),
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
    ViewShareModule,
  ],
  exports: [ViewPage],
})
export class ViewModule {}
