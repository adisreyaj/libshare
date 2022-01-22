import { NgModule } from '@angular/core';
import { RemixIconModule, RiShareBoxLine, RiStarFill, RiStarLine, RiTimeLine } from 'angular-remix-icon';

@NgModule({
  imports: [RemixIconModule.configure({ RiShareBoxLine, RiStarLine, RiStarFill, RiTimeLine })],
  exports: [RemixIconModule],
})
export class IconModule {}
