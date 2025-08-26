// src/app/app.component.ts

import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { AuthService } from './auth/auth.service';
import { NavbarComponent } from './shared/navbar/navbar.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    NavbarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'colo-de-deus-front';
  isMenuOpen = false;
  showNavigation = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.showNavigation = !(
          event.urlAfterRedirects.includes('/login') ||
          event.urlAfterRedirects.includes('/register')
        );
      });
  }

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
