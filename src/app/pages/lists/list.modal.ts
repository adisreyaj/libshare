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
          <div class="flex items-center gap-2 mt-4">
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
                <p class="text-xs text-slate-400 absolute -bottom-8 left-0">
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
              <div formArrayName="libraries" class="grid grid-cols-1 md:grid-cols-3 gap-2 mt-12">
                <article
                  *ngFor="let library of libraries.controls; index as i"
                  class="relative flex items-center gap-2 bg-white p-2 rounded-md border border-slate-200 shadow-md"
                >
                  <button
                    type="button"
                    class="absolute focus:ring-1 focus:!bg-opacity-200 focus:ring-red-500 outline-none top-1 right-1 p-1 hover:!bg-opacity-20 !bg-red-500 !bg-opacity-10 text-red-600 rounded-full"
                    (click)="removeLibraryFromList(i)"
                  >
                    <rmx-icon name="close-line" class="icon-sm"></rmx-icon>
                  </button>
                  <img [src]="library.value.image" [alt]="library.value.name" class="w-10 h-10" />
                  <div>
                    <p class="font-medium line-clamp-1">{{ library.value.name }}</p>
                    <p class="line-clamp-2 text-sm">{{ library.value.description }}</p>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </form>
      </div>
      <footer class="flex items-center gap-4 mt-8">
        <button zzButton variant="primary" (click)="upsert()">Save</button>
        <button zzButton variant="neutral" (click)="this.modalRef.close()">Close</button>
      </footer>
    </div>
    <ng-template #loader>
      <div class="absolute top-0 right-2 h-full grid place-items-center">
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
        @apply text-slate-600 mb-1 text-sm;
      }

      .suggestions {
        min-width: 200px;
        @apply absolute z-10 bg-white border border-slate-200 shadow-xl rounded-md p-2 top-12;
        li {
          @apply px-2 py-1 cursor-pointer rounded-md;
          @apply focus:bg-slate-100 hover:bg-slate-100 focus:outline-none;
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
