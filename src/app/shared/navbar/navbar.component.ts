// src/app/shared/navbar/navbar.component.ts

import {
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RouterLink,
  Router,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    RouterOutlet,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  isMenuOpen = false;
  @Input() showNavigation: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  @ViewChild('navMenu') navMenu!: ElementRef;

  @ViewChild('hamburgerButton') hamburgerButton!: ElementRef;

  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    if (
      this.isMenuOpen &&
      !this.navMenu.nativeElement.contains(event.target) &&
      !this.hamburgerButton.nativeElement.contains(event.target)
    ) {
      this.isMenuOpen = false; // Fecha o menu
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
