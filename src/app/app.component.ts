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
import { SwPush } from '@angular/service-worker';
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

  constructor(
    private authService: AuthService,
    private router: Router,
    private swPush: SwPush
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.showNavigation = !(
          event.urlAfterRedirects.includes('/login') ||
          event.urlAfterRedirects.includes('/register')
        );
      });

    // Código para ouvir e exibir as notificações
    this.swPush.messages.subscribe(async (message: any) => {
      const title = message.title;
      const options = {
        body: message.body,
        data: message.data,
        icon: 'assets/icons/icon-72x72.png',
      };

      // ➡️ Correção: Use navigator.serviceWorker.ready para acessar o registro
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, options);
      });
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
