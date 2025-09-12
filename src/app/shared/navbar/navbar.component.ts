// src/app/shared/navbar/navbar.component.ts

import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
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
import { PermissionDirective } from '../../directives/permission.directive';
import { NotificationsService } from '../../services/notifications.service';
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
    PermissionDirective,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  isMenuOpen = false;
  @Input() showNavigation: boolean = false;
  access_token = localStorage.getItem('access_token') || '';

  isSubscribed: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationsService: NotificationsService
  ) {}

  async ngOnInit(): Promise<void> {
    let permission = await Notification.requestPermission();

    console.log(permission);
    this.notificationsService
      .getNotificationStatus(this.access_token)
      .subscribe({
        next: (valor) => {
          if (valor.subscribed || permission == 'granted') {
            this.isSubscribed = true;
          } else {
            this.isSubscribed = false;
          }
        },
        error: (erro) => {
          console.error('Erro ao buscar status da notificação:', erro);
        },
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

  async toggleNotifications(): Promise<void> {
    const userId = localStorage.getItem('user_id') || '';

    if (this.isSubscribed) {
      this.notificationsService.requestUnsubscription(this.access_token);
      this.isSubscribed = false;
    } else {
      this.notificationsService.requestSubscription(userId, this.access_token);
      this.isSubscribed = true;
    }
  }
}
