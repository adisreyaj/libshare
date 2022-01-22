import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { A11yModule } from '@angular/cdk/a11y';
import { mapTo, Observable, startWith, Subject, switchMap } from 'rxjs';
import { Library } from '../../interfaces/library.interface';
import { LibrariesService } from '../../services/libraries.service';
import { CommonModule } from '@angular/common';
import { LibraryModal } from './library.modal';
import { ButtonModule, FormInputModule, ModalService } from 'zigzag';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LibraryCardModule } from '../../components/library-card.component';

@Component({
  selector: 'app-libraries',
  template: ` <section>
    <header class="flex items-center gap-4">
      <h2>Libraries</h2>
      <button zzButton size="sm" (click)="openModal()">Add New</button>
    </header>
    <div>
      <ul class="grid gap-4 grid-cols-4">
        <li *ngFor="let library of libraries$ | async">
          <app-library-card [library]="library"></app-library-card>
        </li>
      </ul>
    </div>
  </section>`,
})
export class LibrariesPage {
  libraries$: Observable<Library[]>;

  private readonly refreshSubject = new Subject<void>();
  private readonly refresh$ = this.refreshSubject.asObservable().pipe(startWith(null), mapTo(true));

  constructor(private readonly librariesService: LibrariesService, private readonly modal: ModalService) {
    this.libraries$ = this.refresh$.pipe(switchMap(() => this.librariesService.getAll()));
  }

  openModal() {
    const { afterClosed$ } = this.modal.open(LibraryModal, {
      size: 'lg',
      data: {
        name: '',
        description: '',
      },
    });
    afterClosed$.subscribe({
      next: (isSuccess) => {
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
  ],
  exports: [LibrariesPage],
})
export class LibrariesModule {}
