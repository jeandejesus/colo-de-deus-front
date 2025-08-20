// src/app/app.component.ts

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // Importe o RouterOutlet
import { CommonModule } from '@angular/common'; // Importe o CommonModule, se ainda não estiver lá
import { NavbarComponent } from './shared/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent], // Adicione RouterOutlet aqui
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'colo-de-deus-front';
}
