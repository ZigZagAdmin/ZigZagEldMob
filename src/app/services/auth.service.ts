import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthUser } from '../models/auth-user';
import { HttpClient } from '@angular/common/http';
import { AUTH_API_URL } from '../app-injection-tokens';
import { tap } from 'rxjs/operators';

export const ACCESS_TOKEN_KEY = 'bookstore_access_token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    @Inject(AUTH_API_URL) private apiUrl: string
  ) {}

  login(username: string, password: string): Observable<AuthUser> {
    const project = 'ELD';
    return this.http
      .post<AuthUser>(this.apiUrl + 'api/auth/loginDriver', {
        username,
        password,
        project,
      })
      .pipe(
        tap((res) => {
          localStorage.setItem(ACCESS_TOKEN_KEY, res.AccessToken);
          console.log(res);
        })
      );
  }
}
