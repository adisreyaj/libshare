import { NgModule } from '@angular/core';
import { RemixIconModule, RiShareBoxLine, RiStarFill, RiStarLine } from 'angular-remix-icon';

@NgModule({
  imports: [RemixIconModule.configure({ RiShareBoxLine, RiStarLine, RiStarFill })],
  exports: [RemixIconModule],
})
export class IconModule {}
