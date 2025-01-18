import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, tap, throwError} from 'rxjs';
import {TokenResponse} from './auth.interface';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = 'http://localhost:8080/pp';
  cookieService = inject(CookieService);
  http: HttpClient = inject(HttpClient)
  router = inject(Router);

  access_token: string | null = null;
  refresh_token: string | null = null;

  get isAuth() {
    if (!this.access_token) {
      this.access_token = this.cookieService.get('access_token');
      this.refresh_token = this.cookieService.get('refresh_token');
    }
    return !!this.access_token
  }

  login(payload: { username: string, password: string }) {
    return this.http.post<TokenResponse>(`${this.baseUrl}/auth`, payload)
      .pipe(
      tap((res) => {
        this.saveTokens(res)
      })
    )
  }

  refreshAuthToken() {
    return this.http.post<TokenResponse>(
      `${this.baseUrl}/refresh`,
      {
      refresh_token: this.refresh_token
    }
    ).pipe(
      tap(value => this.saveTokens(value)),
      catchError(err => {
        this.logout()
        return throwError(err)
      }
      ))
  }

  logout() {
    this.cookieService.deleteAll()
    this.access_token = null;
    this.refresh_token = null;
    this.router.navigate(['login']);
  }

  saveTokens(response: TokenResponse) {
    this.access_token = response.access_token
    this.refresh_token = response.refresh_token

    this.cookieService.set('access_token', this.access_token)
    this.cookieService.set('refresh_token', this.refresh_token)
  }
}
