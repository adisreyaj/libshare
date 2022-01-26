import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { IS_PUBLIC_API } from '../tokens/public-api.token';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private readonly router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.context.get(IS_PUBLIC_API)) {
      return next.handle(req);
    }
    const token = localStorage.getItem('token');

    if (token != null && token !== '') {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + token),
      });
      return next.handle(cloned);
    } else {
      this.router.navigate(['/login']);
      return throwError(() => new Error('Please login!'));
    }
  }
}
