// src/app/core/directives/permission.directive.ts

import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnInit,
} from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Directive({
  selector: '[appPermission]',
  standalone: true,
})
export class PermissionDirective implements OnInit {
  @Input('appPermission') allowedRoles: string[] = [];

  constructor(
    private authService: AuthService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  ngOnInit(): void {
    const userRole = this.authService.getRoleFromToken();

    // Se o usuário tem um papel e este papel está na lista de papéis permitidos...
    if (userRole && this.allowedRoles.includes(userRole)) {
      // Mostra o elemento injetando-o no DOM
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      // Esconde o elemento removendo-o do DOM
      this.viewContainer.clear();
    }
  }
}
