// src/app/shared/authenticated-layout/authenticated-layout.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-authenticated-layout',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterOutlet],
  templateUrl: './authenticated-layout.component.html',
  styleUrl: './authenticated-layout.component.scss',
})
export class AuthenticatedLayoutComponent implements OnInit {
  showNavigation = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.showNavigation = !!(
          event.urlAfterRedirects.includes('/login') ||
          event.urlAfterRedirects.includes('/register') ||
          event.urlAfterRedirects.includes('/reset-password') ||
          event.urlAfterRedirects.includes('/reset')
        );
      });
  }
}
