import { Component, HostListener, OnInit } from '@angular/core';
import { ModalRef } from 'zigzag';
import { LibrariesService } from '../../services/libraries.service';
import { FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, catchError, filter, map, of, Subject, switchMap, tap } from 'rxjs';
import { Library, LibraryRequest } from '../../interfaces/library.interface';

@Component({
  template: `
    <header class="mb-4">
      <h1 class="title">{{ this.modalRef.data.isEditMode ? 'Update' : 'Add' }} Library</h1>
    </header>
    <div cdkTrapFocus>
      <form [formGroup]="libraryForm" id="libraryForm">
        <div class="max-w-sm">
          <div>
            <label for="name">Name</label>
            <div class="relative">
              <input
                type="text"
                formControlName="name"
                id="name"
                zzInput
                variant="fill"
                class="w-full"
                autofocus
                required
                autocomplete="off"
                (keydown)="refreshSuggestions($event.ctrlKey, $event.code)"
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
                        (click)="autoFill(suggestion.name)"
                        (keydown)="this.onSuggestionKeyDown($event.code, suggestion.name)"
                        tabindex="0"
                      >
                        {{ suggestion.name }}
                      </li>
                    </ng-container>
                  </ul>
                </div>
              </ng-container>
            </div>
          </div>
        </div>
        <section class="mt-10" *ngIf="suggestionSelected">
          <div>
            <label>Logo</label>
            <ng-container *ngIf="this.libraryForm.get('image')?.value as image; else noImage">
              <img [src]="image" [alt]="this.libraryForm.get('name')?.value" class="h-16 w-16" />
            </ng-container>
            <ng-template #noImage>
              <div class="grid h-16 w-16 place-items-center rounded-full bg-slate-100 text-center">
                <span class="text-xs text-gray-500">No image</span>
              </div>
            </ng-template>
          </div>
          <div class="mt-4">
            <label for="description">Description</label>
            <div class="relative">
              <input type="text" formControlName="description" id="description" zzInput variant="fill" class="w-full" />

              <ng-container *ngIf="metadataLoading$ | async">
                <ng-container *ngTemplateOutlet="loader"></ng-container>
              </ng-container>
            </div>
          </div>
          <fieldset class="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label for="github">Github</label>
              <div class="relative">
                <input type="text" formControlName="github" id="github" zzInput variant="fill" class="w-full" />

                <ng-container *ngIf="metadataLoading$ | async">
                  <ng-container *ngTemplateOutlet="loader"></ng-container>
                </ng-container>
              </div>
            </div>
            <div>
              <label for="homepage">Homepage</label>
              <div class="relative">
                <input type="text" formControlName="homepage" id="homepage" zzInput variant="fill" class="w-full" />

                <ng-container *ngIf="metadataLoading$ | async">
                  <ng-container *ngTemplateOutlet="loader"></ng-container>
                </ng-container>
              </div>
            </div>
          </fieldset>
        </section>
      </form>
    </div>
    <footer class="mt-12 flex items-center gap-4">
      <button zzButton variant="primary" (click)="upsert()">Save</button>
      <button zzButton variant="neutral" (click)="this.modalRef.close()">Close</button>
    </footer>

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
export class LibraryModal implements OnInit {
  libraryForm = this.fb.group({
    name: ['', Validators.required],
    image: [''],
    description: [''],
    github: [''],
    homepage: [''],
  });

  libraryDetails: LibraryRequest | null = null;

  private suggestionsSubject = new BehaviorSubject<{ name: string }[]>([]);
  suggestions$ = this.suggestionsSubject.asObservable();

  private refreshSuggestionsSubject = new Subject<void>();

  private suggestionsVisibleSubject = new BehaviorSubject<boolean>(false);
  suggestionsVisible$ = this.suggestionsVisibleSubject.asObservable();

  private metadataLoadingSubject = new BehaviorSubject<boolean>(false);
  metadataLoading$ = this.metadataLoadingSubject.asObservable().pipe(
    tap((isLoading) => {
      this.updateFieldsDisabledStates(isLoading);
    }),
  );

  private suggestionsLoadingSubject = new BehaviorSubject<boolean>(false);
  suggestionsLoading$ = this.suggestionsLoadingSubject.asObservable().pipe(
    tap((isLoading) => {
      this.updateFieldsDisabledStates(isLoading);
    }),
  );

  suggestionSelected = false;

  @HostListener('keydown.esc')
  onEsc() {
    if (this.suggestionsVisibleSubject.value) {
      this.suggestionsVisibleSubject.next(false);
    }
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (this.suggestionsVisibleSubject.value) {
      const suggestionsElement = this.modalRef.element.querySelector('.suggestions');
      if (suggestionsElement && !suggestionsElement.contains(event.target as Node)) {
        this.suggestionsVisibleSubject.next(false);
      }
    }
  }

  constructor(
    public readonly modalRef: ModalRef<{ isEditMode: boolean; library: Library }>,
    private readonly fb: FormBuilder,
    private readonly libraries: LibrariesService,
  ) {
    this.refreshSuggestionsSubject
      .asObservable()
      .pipe(
        map(() => this.libraryForm.get('name')?.value),
        filter((name) => name != ''),
        tap(() => this.suggestionsLoadingSubject.next(true)),
        switchMap((name) => {
          return this.libraries.getSuggestions(name);
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

  ngOnInit() {
    if (this.modalData?.isEditMode ?? false) {
      this.libraryDetails = this.modalData.library;
      this.suggestionSelected = true;
      this.libraryForm.get('name')?.setValue(this.modalData.library.name);
      this.setValues(this.modalData.library);
    }
  }

  get modalData() {
    return this.modalRef.data;
  }

  autoFill(name: string) {
    this.suggestionSelected = true;
    this.suggestionsVisibleSubject.next(false);
    if (name !== '') {
      this.metadataLoadingSubject.next(true);
      this.resetDependentFields();
      this.libraries.getLibraryMetadata(name).subscribe({
        next: (result) => {
          this.libraryDetails = result;
          this.setValues(result);
          this.metadataLoadingSubject.next(false);
        },
        error: () => {
          this.metadataLoadingSubject.next(false);
        },
      });
    }
  }

  private setValues(result: Library) {
    this.libraryForm.get('description')?.setValue(result.description);
    this.libraryForm.get('github')?.setValue(result.links.repository ?? result.github.url ?? '');
    this.libraryForm.get('homepage')?.setValue(result.links.homepage);
    this.libraryForm.get('image')?.setValue(result.github.image);
  }

  refreshSuggestions(ctrlKey: boolean, code: string) {
    const isKeyValid = code === 'Enter' || (code === 'Space' && ctrlKey);
    if (this.libraryForm.get('name')?.value !== '' && isKeyValid) {
      this.refreshSuggestionsSubject.next();
    }
  }

  upsert() {
    if (this.libraryForm.valid && this.libraryDetails) {
      (this.modalData.isEditMode
        ? this.libraries.update(this.modalData.library.id, this.getUpdatedLibraryDetails())
        : this.libraries.addNew(this.libraryDetails)
      ).subscribe({
        next: () => {
          this.modalRef.close(true);
        },
      });
    }
  }

  private getUpdatedLibraryDetails() {
    if (this.libraryDetails == null) {
      return {};
    }
    const { name, description, homepage, github } = this.libraryForm.value;
    if (name) this.libraryDetails.name = name;
    if (description) this.libraryDetails.description = description;
    if (homepage) this.libraryDetails.links.homepage = homepage;
    if (github) this.libraryDetails.links.repository = github;
    return this.libraryDetails;
  }

  onSuggestionKeyDown(code: string, value: string) {
    if (['Enter', 'Space'].includes(code)) {
      this.libraryForm.get('name')?.setValue(value);
      this.autoFill(value);
    }
  }

  private resetDependentFields() {
    this.libraryForm.get('description')?.disable();
    this.libraryForm.get('github')?.disable();
    this.libraryForm.get('homepage')?.disable();
  }

  private updateFieldsDisabledStates(isLoading: boolean) {
    if (isLoading) {
      this.libraryForm.get('description')?.disable();
      this.libraryForm.get('github')?.disable();
      this.libraryForm.get('homepage')?.disable();
    } else {
      this.libraryForm.get('description')?.enable();
      this.libraryForm.get('github')?.enable();
      this.libraryForm.get('homepage')?.enable();
    }
  }
}
