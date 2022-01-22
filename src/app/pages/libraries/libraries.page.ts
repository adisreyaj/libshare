import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  template: ``,
})
export class HomePage {}

@NgModule({
  declarations: [HomePage],
  imports: [RouterModule.forChild([{ path: '', component: HomePage }])],
  exports: [HomePage],
})
export class HomeModule {}
