// src/app/core/guards/roles.guard.ts

import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class RolesGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const requiredRoles = route.data['roles'] as string[];
    const userRole = this.authService.getUserRole();

    // Se a rota não exige papéis específicos, permite o acesso
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Se o usuário está logado e tem a permissão necessária
    if (userRole && requiredRoles.includes(userRole)) {
      return true;
    }

    // Se não tem a permissão, redireciona para a página inicial (ou de acesso negado)
    this.router.navigate(['/']);

    // Mostre um aviso no console para fins de depuração
    console.warn(
      'Acesso negado. O usuário não tem o papel necessário para acessar esta rota.'
    );

    return false;
  }
}
