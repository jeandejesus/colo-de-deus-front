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
import { SwPush, SwUpdate } from '@angular/service-worker';
import { environment } from '../environments/environment';

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
  readonly VAPID_PUBLIC_KEY = environment.vapidPublicKey;

  constructor(
    private authService: AuthService,
    private router: Router,
    private swPush: SwPush,
    private swUpdate: SwUpdate
  ) {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.subscribe((event) => {
        switch (event.type) {
          case 'VERSION_DETECTED':
            console.log(`🆕 Nova versão detectada: ${event.version.hash}`);
            break;
          case 'VERSION_READY':
            console.log(`✅ Nova versão pronta: ${event.latestVersion.hash}`);
            if (confirm('Nova versão disponível. Deseja atualizar agora?')) {
              this.swUpdate
                .activateUpdate()
                .then(() => document.location.reload());
            }
            break;
          case 'VERSION_INSTALLATION_FAILED':
            console.error('❌ Erro ao instalar nova versão', event.error);
            break;
        }
      });
    }
  }

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.showNavigation = !(
          event.urlAfterRedirects.includes('/login') ||
          event.urlAfterRedirects.includes('/register') ||
          event.urlAfterRedirects.includes('/reset-password') ||
          event.urlAfterRedirects.includes('/reset')
        );
      });

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg) {
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (
                  newWorker.state === 'installed' &&
                  navigator.serviceWorker.controller
                ) {
                  const confirmar = confirm(
                    'Nova versão disponível. Deseja atualizar agora?'
                  );
                  if (confirmar) {
                    newWorker.postMessage({ action: 'skipWaiting' });
                  }
                }
              });
            }
          });
        }
      });
    }
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
      this.isMenuOpen = false;
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
