import { Component, OnInit } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { ListPublic } from '../../interfaces/list.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { ListsService } from '../../services/lists.service';

@Component({
  selector: 'app-list-detail',
  template: `
    <div class="box my-10" *ngIf="list$ | async as list">
      <app-view-shared [list]="list"></app-view-shared>
    </div>
  `,
  styles: [],
})
export class ListDetailPage implements OnInit {
  list$!: Observable<ListPublic>;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly listsService: ListsService,
    private readonly route: Router,
  ) {}

  ngOnInit() {
    this.list$ = this.activatedRoute.params.pipe(switchMap((params) => this.listsService.getList(params['id'])));
  }
}
