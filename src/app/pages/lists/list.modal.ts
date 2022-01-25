import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, catchError, filter, of, Subject, switchMap, tap } from 'rxjs';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { List, ListLibraryData } from '../../interfaces/list.interface';
import { ModalRef } from 'zigzag';
import { ListsService } from '../../services/lists.service';
import { LibrariesService } from '../../services/libraries.service';

@Component({
  selector: 'app-list-modal',
  template: `
    <div cdkTrapFocus>
      <header class="mb-4">
        <h1 class="title">{{ this.modalRef.data.isEditMode ? 'Update' : 'Create New' }} List</h1>
      </header>
      <div>
        <form [formGroup]="listForm" id="listForm">
          <div>
            <label for="name">Name</label>
            <div class="relative">
              <input
                type="text"
                formControlName="name"
                placeholder="My fav front-end frameworks"
                id="name"
                zzInput
                variant="fill"
                class="w-full"
                required
                autofocus
                autocomplete="off"
              />
            </div>
          </div>
          <div class="mt-4">
            <label for="description">Description</label>
            <div class="relative">
              <input
                type="text"
                formControlName="description"
                id="description"
                zzInput
                variant="fill"
                class="w-full"
                autocomplete="off"
              />
            </div>
          </div>
          <div class="mt-4 flex items-center gap-2">
            <div class="relative">
              <input type="checkbox" formControlName="public" id="public" zzInput variant="fill" />
            </div>
            <label for="public" class="!mb-0">Is Public?</label>
          </div>
          <div class="mt-4">
            <h3>Add Libraries to List</h3>
            <div>
              <div class="relative">
                <input
                  type="text"
                  [formControl]="searchInput"
                  placeholder="Search for libraries in your account"
                  zzInput
                  variant="fill"
                  class="w-full"
                  autocomplete="off"
                  #searchInputRef
                  (keydown)="refreshSuggestions($event.ctrlKey, $event.code, searchInput.value)"
                />
                <p class="absolute -bottom-8 left-0 text-xs text-slate-400">
                  Press <kbd>Enter</kbd> or <kbd>Ctrl</kbd> + <kbd>Space</kbd> to search
                </p>
                <ng-container *ngIf="suggestionsLoading$ | async">
                  <ng-container *ngTemplateOutlet="loader"></ng-container>
                </ng-container>
                <ng-container *ngIf="suggestionsVisible$ | async">
                  <div id="suggestions" class="suggestions" *ngIf="suggestions$ | async as suggestions" cdkTrapFocus>
                    <ul>
                      <ng-container *ngFor="let suggestion of suggestions; index as i">
                        <li
                          (click)="addLibrary(suggestion)"
                          (keydown)="onSuggestionKeyDown($event.code, suggestion)"
                          tabindex="0"
                        >
                          {{ suggestion.name }}
                        </li>
                      </ng-container>
                    </ul>
                  </div>
                </ng-container>
              </div>
              <div formArrayName="libraries" class="mt-12 grid grid-cols-1 gap-2 md:grid-cols-3">
                <article
                  *ngFor="let library of libraries.controls; index as i"
                  class="relative flex items-center gap-2 rounded-md border border-slate-200 bg-white p-2 shadow-md"
                >
                  <button
                    type="button"
                    class="focus:!bg-opacity-200 absolute top-1 right-1 rounded-full !bg-red-500 !bg-opacity-10 p-1 text-red-600 outline-none hover:!bg-opacity-20 focus:ring-1 focus:ring-red-500"
                    (click)="removeLibraryFromList(i)"
                  >
                    <rmx-icon name="close-line" class="icon-sm"></rmx-icon>
                  </button>
                  <img [src]="library.value.image" [alt]="library.value.name" class="h-10 w-10" />
                  <div>
                    <p class="font-medium line-clamp-1">{{ library.value.name }}</p>
                    <p class="text-sm line-clamp-2">{{ library.value.description }}</p>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </form>
      </div>
      <footer class="mt-8 flex items-center gap-4">
        <button zzButton variant="primary" (click)="upsert()">Save</button>
        <button zzButton variant="neutral" (click)="this.modalRef.close()">Close</button>
      </footer>
    </div>
    <ng-template #loader>
      <div class="absolute top-0 right-2 grid h-full place-items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          style="margin:auto;background:0 0;display:block;shape-rendering:auto"
          width="24"
          height="24"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid"
        >
          <circle
            cx="50"
            cy="50"
            fill="none"
            stroke="#3b3d6d"
            stroke-width="10"
            r="42"
            stroke-dasharray="197.92033717615698 67.97344572538566"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              repeatCount="indefinite"
              dur="0.5319148936170213s"
              values="0 50 50;360 50 50"
              keyTimes="0;1"
            />
          </circle>
        </svg>
      </div>
    </ng-template>
  `,
  styles: [
    `
      .title {
        @apply text-2xl font-medium;
      }

      form label {
        @apply mb-1 text-sm text-slate-600;
      }

      .suggestions {
        min-width: 200px;
        @apply absolute top-12 z-10 rounded-md border border-slate-200 bg-white p-2 shadow-xl;
        li {
          @apply cursor-pointer rounded-md px-2 py-1;
          @apply hover:bg-slate-100 focus:bg-slate-100 focus:outline-none;
        }
      }
    `,
  ],
})
export class ListModal implements OnInit {
  listForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    public: ['false', Validators.required],
    libraries: this.fb.array([]),
  });

  searchInput = new FormControl('');
  private suggestionsSubject = new BehaviorSubject<ListLibraryData[]>([]);
  suggestions$ = this.suggestionsSubject.asObservable();

  private refreshSuggestionsSubject = new Subject<string>();

  private suggestionsVisibleSubject = new BehaviorSubject<boolean>(false);
  suggestionsVisible$ = this.suggestionsVisibleSubject.asObservable();

  private suggestionsLoadingSubject = new BehaviorSubject<boolean>(false);
  suggestionsLoading$ = this.suggestionsLoadingSubject.asObservable();

  get libraries(): FormArray {
    return this.listForm.get('libraries') as FormArray;
  }

  @ViewChild('searchInputRef', { read: ElementRef }) searchInputRef?: ElementRef<HTMLInputElement>;

  constructor(
    private readonly fb: FormBuilder,
    private readonly listsService: ListsService,
    private readonly librariesService: LibrariesService,
    public readonly modalRef: ModalRef<{ isEditMode: boolean; list: List }>,
  ) {
    this.refreshSuggestionsSubject
      .asObservable()
      .pipe(
        filter((name) => name != ''),
        tap(() => this.suggestionsLoadingSubject.next(true)),
        switchMap((name) => {
          return this.librariesService.searchLibraries(name);
        }),
        tap(() => this.suggestionsLoadingSubject.next(false)),
        catchError(() => of([])),
      )
      .subscribe({
        next: (result) => {
          this.suggestionsSubject.next(result);
          if (result.length > 0) this.suggestionsVisibleSubject.next(true);
        },
      });
  }

  get modalData() {
    return this.modalRef.data;
  }

  ngOnInit() {
    if (this.modalData?.isEditMode ?? false) {
      this.setValues(this.modalData.list);
    }
  }

  upsert() {
    if (this.listForm.valid) {
      const observable$ = this.modalData.isEditMode
        ? this.listsService.update(this.modalData.list.id, this.listForm.value)
        : this.listsService.addNew(this.listForm.value);
      observable$.subscribe({
        next: () => {
          this.modalRef.close(true);
        },
      });
    }
  }

  refreshSuggestions(ctrlKey: boolean, code: string, query: string) {
    if (code === 'Enter' || (code === 'Space' && ctrlKey)) {
      this.refreshSuggestionsSubject.next(query);
    }
  }

  addLibrary(library: ListLibraryData) {
    this.libraries.push(this.fb.control(library));
    this.suggestionsVisibleSubject.next(false);
    this.searchInput.reset();
    setTimeout(() => {
      this.searchInputRef?.nativeElement.focus();
    });
  }

  onSuggestionKeyDown(code: string, library: ListLibraryData) {
    if (['Enter', 'Space'].includes(code)) {
      this.addLibrary(library);
    }
  }

  removeLibraryFromList(i: number) {
    this.libraries.removeAt(i);
  }

  private setValues(result: List) {
    this.listForm.get('name')?.setValue(result.name);
    this.listForm.get('description')?.setValue(result.description ?? '');
    this.listForm.get('public')?.setValue(result.public);
    (result.libraries ?? []).forEach((lib) => {
      this.libraries.push(this.fb.control(lib));
    });
  }
}
