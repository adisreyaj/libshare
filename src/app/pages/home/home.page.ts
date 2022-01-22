import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LibrariesService } from '../../services/libraries.service';
import { Observable } from 'rxjs';
import { Library } from '../../interfaces/library.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  template: `
    <section>
      <h2>Latest Additions</h2>
      <div>
        <ul>
          <li *ngFor="let library of libraries$ | async">
            <p>{{ library?.name }}</p>
          </li>
        </ul>
      </div>
    </section>
  `,
})
export class HomePage {
  libraries$: Observable<Library[]>;

  constructor(private readonly librariesService: LibrariesService) {
    this.libraries$ = this.librariesService.getAll();
  }
}

@NgModule({
  declarations: [HomePage],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: HomePage }])],
  exports: [HomePage],
})
export class HomeModule {}
