import { NgModule } from '@angular/core';
import { ListModal } from './list.modal';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PageHeaderModule } from '../../components/page-header.component';
import { ReactiveFormsModule } from '@angular/forms';
import { A11yModule } from '@angular/cdk/a11y';
import { ButtonModule, DropdownModule, FormInputModule, TooltipModule } from 'zigzag';
import { IconModule } from '../../icon.module';
import { ListCardModule } from '../../components/list-card.component';
import { ListsPage } from './lists.page';
import { ListDetailPage } from './list-detail.page';
import { ViewShareModule } from '../view/view-share.component';

@NgModule({
  declarations: [ListsPage, ListModal, ListDetailPage],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ListsPage,
      },
      {
        path: ':id',
        component: ListDetailPage,
      },
    ]),
    PageHeaderModule,
    ReactiveFormsModule,
    A11yModule,
    ButtonModule,
    FormInputModule,
    IconModule,
    TooltipModule,
    DropdownModule,
    ListCardModule,
    ViewShareModule,
  ],
  exports: [ListsPage],
})
export class ListsModule {}
