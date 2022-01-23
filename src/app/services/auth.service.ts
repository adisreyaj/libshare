import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { API_URL } from '../core/tokens/api.token';
import { IS_PUBLIC_API } from '../core/tokens/public-api.token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private readonly http: HttpClient,
    @Inject(API_URL) private readonly apiUrl: string,
  ) {}

  login(email: string, password: string) {
    return this.http.post<{ token: string }>(
      `${this.apiUrl}/login`,
      {
        email,
        password,
      },
      {
        context: new HttpContext().set(IS_PUBLIC_API, true),
      },
    );
  }
}
