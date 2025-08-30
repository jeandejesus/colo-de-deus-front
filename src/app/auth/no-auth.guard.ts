// src/app/auth/guards/no-auth.guard.ts

import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class NoAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const isLoggedIn = this.authService.isLoggedIn(); // ✅ Verifica se o usuário está logado

    if (isLoggedIn) {
      // ✅ Se o token existir, redireciona para o dashboard
      return this.router.createUrlTree(['/dashboard']);
    }

    // ✅ Se o token não existir, permite o acesso à rota de login
    return true;
  }
}
