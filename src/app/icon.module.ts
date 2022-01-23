import { NgModule } from '@angular/core';
import {
  RemixIconModule,
  RiArrowDownSLine,
  RiCloseLine,
  RiLockLine,
  RiLockUnlockLine,
  RiMore2Fill,
  RiShareBoxLine,
  RiStarFill,
  RiStarLine,
  RiTimeLine,
} from 'angular-remix-icon';

@NgModule({
  imports: [
    RemixIconModule.configure({
      RiCloseLine,
      RiShareBoxLine,
      RiStarLine,
      RiStarFill,
      RiTimeLine,
      RiArrowDownSLine,
      RiLockLine,
      RiLockUnlockLine,
      RiMore2Fill,
    }),
  ],
  exports: [RemixIconModule],
})
export class IconModule {}
