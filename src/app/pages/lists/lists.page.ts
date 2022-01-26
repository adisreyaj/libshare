import { Component } from '@angular/core';
import { ListModal } from './list.modal';
import { ModalService } from 'zigzag';
import { filter, mapTo, Observable, startWith, Subject, switchMap } from 'rxjs';
import { ListsService } from '../../services/lists.service';
import { List } from '../../interfaces/list.interface';

@Component({
  selector: 'app-lists',
  template: ` <section class="mt-10">
    <app-page-header title="Lists" buttonText="Add New" (clicked)="openModal()"></app-page-header>
    <div class="mt-6">
      <ul class="grid grid-cols-4 gap-4">
        <ng-container *ngFor="let list of lists$ | async">
          <app-list-card [list]="list" (edit)="editList($event)" (delete)="deleteList($event)"></app-list-card>
        </ng-container>
      </ul>
    </div>
  </section>`,
  styles: [
    `
      .list-card {
        .visibility {
          @apply block;
        }

        .options {
          @apply hidden;
        }

        &:hover {
          .visibility {
            @apply hidden;
          }

          .options {
            @apply block;
          }
        }
      }
    `,
  ],
})
export class ListsPage {
  lists$: Observable<List[]>;
  private readonly refreshSubject = new Subject<void>();
  private readonly refresh$ = this.refreshSubject.asObservable().pipe(startWith(null), mapTo(true));

  constructor(private readonly listsService: ListsService, private readonly modal: ModalService) {
    this.lists$ = this.refresh$.pipe(switchMap(() => this.listsService.getAll()));
  }

  openModal() {
    const { afterClosed$ } = this.modal.open<{ isEditMode: boolean }>(ListModal, {
      size: 'lg',
      data: {
        isEditMode: false,
      },
    });
    afterClosed$.pipe(filter((isSuccess) => isSuccess as boolean)).subscribe({
      next: () => {
        this.refreshSubject.next();
      },
    });
  }

  editList(list: List) {
    const { afterClosed$ } = this.modal.open<{ isEditMode: boolean; list: List }>(ListModal, {
      size: 'lg',
      data: {
        isEditMode: true,
        list,
      },
    });
    afterClosed$.pipe(filter((isSuccess) => isSuccess as boolean)).subscribe({
      next: () => {
        this.refreshSubject.next();
      },
    });
  }

  deleteList(list: List) {}
}
