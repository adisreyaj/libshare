import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShellComponent } from './shell.component';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.page').then((m) => m.LoginModule),
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.page').then((m) => m.SignupModule),
  },
  {
    path: 'view/:slug',
    loadChildren: () => import('./pages/view/view.page').then((m) => m.ViewModule),
  },
  {
    path: '',
    component: ShellComponent,
    canActivateChild: [],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'libraries',
      },
      {
        path: 'lists',
        loadChildren: () => import('./pages/lists/lists.module').then((m) => m.ListsModule),
      },
      {
        path: 'libraries',
        loadChildren: () => import('./pages/libraries/libraries.page').then((m) => m.LibrariesModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
