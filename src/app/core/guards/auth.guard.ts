// Create a guard to check if jwt is present in the local storage

import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthGuard implements CanActivateChild {
  constructor(private readonly router: Router) {}

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const isTokenPresent = !!localStorage.getItem('token');
    if (isTokenPresent) {
      return true;
    } else {
      return this.router.createUrlTree(['/login']);
    }
  }
}
