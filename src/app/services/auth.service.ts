import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { API_URL } from '../core/tokens/api.token';
import { IS_PUBLIC_API } from '../core/tokens/public-api.token';
import { BehaviorSubject, catchError, EMPTY, switchMap, tap } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    @Inject(API_URL) private readonly apiUrl: string,
    private readonly router: Router,
  ) {}

  logout() {
    this.userSubject.next(null);
    localStorage.removeItem('token');
    return this.router.navigate(['/login']);
  }

  getLoggedInUserDetails() {
    return this.http.get<User>(`${this.apiUrl}/me`).pipe(
      tap((user) => {
        this.userSubject.next(user);
      }),
      catchError((err) => {
        return EMPTY;
      }),
    );
  }

  login(email: string, password: string) {
    return this.http
      .post<{ token: string; user: User }>(
        `${this.apiUrl}/login`,
        {
          email,
          password,
        },
        {
          context: new HttpContext().set(IS_PUBLIC_API, true),
        },
      )
      .pipe(
        tap((result) => {
          this.userSubject.next(result.user);
        }),
      );
  }

  signup(credentials: { firstName: string; lastName: string; email: string; password: string }) {
    return this.http
      .post(`${this.apiUrl}/signup`, credentials, {
        context: new HttpContext().set(IS_PUBLIC_API, true),
      })
      .pipe(switchMap(() => this.router.navigate(['/login'])));
  }
}
