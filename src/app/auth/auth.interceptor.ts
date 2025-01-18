import {catchError, switchMap, throwError} from 'rxjs';
import {AuthService} from './auth.service';
import {HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {TokenResponse} from './auth.interface';

let isRefreshing = false;

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).access_token;
  const authService = inject(AuthService);

  if (!token) return next(req);
  if (isRefreshing) {
    return refreshAndProceed(authService, req, next);
  }

  return next(addToken(req, token)).pipe(
    catchError(err => {
      if (err.status === 403) {
        return refreshAndProceed(authService, req, next);
      }
      return throwError(err);
    })
  );
};

const refreshAndProceed = (
  authService: AuthService,
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  if (!isRefreshing) {
    isRefreshing = true;
    return authService.refreshAuthToken().pipe(
      switchMap((res: TokenResponse) => {
        isRefreshing = false;
        return next(addToken(req, res.access_token));
      })
    );
  }
  return next(addToken(req, authService.access_token!));
};

const addToken = (req: HttpRequest<any>, token: string) => {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
};
