import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthUser } from '../models/auth-user';
import { HttpClient } from '@angular/common/http';
import { AUTH_API_URL } from '../app-injection-tokens';
import { JwtHelperService } from '@auth0/angular-jwt';
import { tap } from 'rxjs/operators';

export const ACCESS_TOKEN_KEY = 'bookstore_access_token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    @Inject(AUTH_API_URL) private apiUrl: string,
    private jwtHelper: JwtHelperService
  ) {}

  login(username: string, password: string, deviceModel: string, operatingSystem: string, appVersion: string): Observable<AuthUser> {
    const project = 'ELD';
    return this.http
      .post<AuthUser>(this.apiUrl + 'api/auth/loginDriver', {
        username: username,
        password: password,
        project: project,
        simcard: '',
        deviceModel: deviceModel,
        operatingSystem: operatingSystem,
        appVersion: appVersion
      })
      .pipe(
        tap((res) => {
          localStorage.setItem(ACCESS_TOKEN_KEY, res.AccessToken);
        })
      );
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    return token !== null && !this.jwtHelper.isTokenExpired(token);
  }
}
