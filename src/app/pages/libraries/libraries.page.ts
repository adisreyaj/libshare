import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { A11yModule } from '@angular/cdk/a11y';
import { catchError, filter, mapTo, Observable, of, startWith, Subject, switchMap, tap } from 'rxjs';
import { Library } from '../../interfaces/library.interface';
import { LibrariesService } from '../../services/libraries.service';
import { CommonModule } from '@angular/common';
import { LibraryModal } from './library.modal';
import { ButtonModule, FormInputModule, ModalService } from 'zigzag';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LibraryCardModule } from '../../components/library-card.component';
import { PageHeaderModule } from '../../components/page-header.component';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-libraries',
  template: ` <section class="mt-10">
    <app-page-header title="Libraries" buttonText="Add New" (clicked)="openModal()"></app-page-header>
    <div class="mt-6">
      <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <li *ngFor="let library of libraries$ | async">
          <app-library-card
            [library]="library"
            (edit)="editLibrary($event)"
            (delete)="deleteLibrary($event)"
          ></app-library-card>
        </li>
      </ul>
    </div>
  </section>`,
})
export class LibrariesPage {
  libraries$: Observable<Library[]>;

  private readonly refreshSubject = new Subject<void>();
  private readonly refresh$ = this.refreshSubject.asObservable().pipe(startWith(null), mapTo(true));

  constructor(
    private readonly librariesService: LibrariesService,
    private readonly modal: ModalService,
    public readonly loader: LoaderService,
  ) {
    this.libraries$ = this.refresh$.pipe(
      tap(() => {
        this.loader.show();
      }),
      switchMap(() => this.librariesService.getAll()),
      tap(() => {
        this.loader.hide();
      }),
      catchError(() => {
        this.loader.hide();
        return of([]);
      }),
    );
  }

  openModal() {
    const { afterClosed$ } = this.modal.open<{ isEditMode: boolean }>(LibraryModal, {
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

  deleteLibrary(id: string) {
    this.librariesService.delete(id).subscribe({
      next: () => {
        this.refreshSubject.next();
      },
    });
  }

  editLibrary(library: Library) {
    const { afterClosed$ } = this.modal.open<{ isEditMode: boolean; library: Library }>(LibraryModal, {
      size: 'lg',
      data: { isEditMode: true, library },
    });
    afterClosed$.pipe(filter((isSuccess) => isSuccess as boolean)).subscribe({
      next: () => {
        this.refreshSubject.next();
      },
    });
  }
}

@NgModule({
  declarations: [LibrariesPage, LibraryModal],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: LibrariesPage }]),
    ButtonModule,
    FormInputModule,
    FormsModule,
    ReactiveFormsModule,
    A11yModule,
    LibraryCardModule,
    PageHeaderModule,
  ],
  exports: [LibrariesPage],
})
export class LibrariesModule {}
