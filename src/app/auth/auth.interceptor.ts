import {HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthService} from './auth.service';
import {catchError, throwError} from 'rxjs';
import {Handler} from 'express';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  //const token = inject(AuthService).access_token
  const authService = inject(AuthService);
  const token = authService.access_token;
  if (!token) return next(req)
  req = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  })
  return next(req)
    .pipe(
      catchError(err => {
        if (err.status === 403) {
          return refreshAndProcced(authService, req, next)
        }
        return throwError(err)
      })
    )
}
const refreshAndProcced = (authService: AuthService,
                           req: HttpRequest<any>,
                           next: HttpHandlerFn) => {
  return//ToDo
}
