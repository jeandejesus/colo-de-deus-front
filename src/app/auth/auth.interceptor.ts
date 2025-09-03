// src/app/core/interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const authToken = authService.getToken();

  if (authToken) {
    if (authService.isTokenExpired(authToken)) {
      // Token expirado → forçar logout
      authService.logout();
      router.navigate(['/login']);
      return next(req); // requisição segue sem token (ou poderia abortar)
    }

    const authRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return next(authRequest);
  }

  return next(req);
};
