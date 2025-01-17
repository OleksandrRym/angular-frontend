import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs';
import {TokenResponse} from './auth.interface';
import {CookieService} from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = 'http://localhost:8080/pp/auth';
  cookieService = inject(CookieService);
  http: HttpClient = inject(HttpClient)

  access_token: string | null = null;
  refresh_token: string | null = null;

  get isAuth() {
    if (!this.access_token){
      this.access_token = this.cookieService.get('access_token');
    }
    return !!this.access_token
  }

  login(payload: { username: string, password: string }) {
    return this.http.post<TokenResponse>(this.baseUrl, payload).pipe(
      tap(val => {
          this.access_token = val.access_token
          this.refresh_token = val.refresh_token

          this.cookieService.set('access_token', val.access_token)
          this.cookieService.set('refresh_token', val.refresh_token)
        }
      )
    )
  }
}
