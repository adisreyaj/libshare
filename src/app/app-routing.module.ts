import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShellComponent } from './shell.component';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.page').then((m) => m.LoginModule),
  },
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadChildren: () => import('./pages/home/home.page').then((m) => m.HomeModule),
      },
      {
        path: 'lists',
        loadChildren: () => import('./pages/lists/lists.page').then((m) => m.ListsModule),
      },
      {
        path: 'libraries',
        loadChildren: () =>
          import('./pages/libraries/libraries.page').then((m) => m.LibrariesModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
