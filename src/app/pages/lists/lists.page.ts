import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-lists',
  template: ``,
})
export class ListsPage {}

@NgModule({
  declarations: [ListsPage],
  imports: [RouterModule.forChild([{ path: '', component: ListsPage }])],
  exports: [ListsPage],
})
export class ListsModule {}
