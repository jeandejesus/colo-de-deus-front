import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService, EventModel } from '../../../services/event.service';
import { QRCodeComponent } from 'angularx-qrcode';
import { AuthService } from '../../../auth/auth.service';
import { RouterModule } from '@angular/router';
import { PermissionDirective } from '../../../directives/permission.directive';

@Component({
  selector: 'app-user-event-list',
  standalone: true,
  imports: [CommonModule, QRCodeComponent, RouterModule, PermissionDirective],
  templateUrl: './user-event-list.component.html',
  styleUrls: ['./user-event-list.component.scss'],
})
export class UserEventListComponent implements OnInit {
  userId = '';

  registeredEvents: Set<string> = new Set(); // eventos em que o usuário está inscrito

  constructor(
    private eventService: EventService,
    private authService: AuthService
  ) {
    this.userId = this.authService.getUserFromToken() || '';
  }

  events: EventModel[] = [];

  registeredQrCodes: Record<string, string> = {}; // eventId -> qrCode

  ngOnInit(): void {
    this.loadEvents();
    this.loadUserRegistrations();
  }

  loadUserRegistrations() {
    this.eventService.getUserRegistrations(this.userId).subscribe({
      next: (res) => {
        // res: { eventId: string, qrCode: string }[]
        this.registeredQrCodes = {};
        res.forEach((r) => {
          this.registeredQrCodes[r.eventId] = r.qrCode;
        });

        // também podemos popular o set para checagem rápida
        this.registeredEvents = new Set(res.map((r) => r.eventId));
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  loadEvents() {
    this.eventService.getEvents().subscribe({
      next: (res) => {
        const now = new Date();
        this.events = res.filter((e) => new Date(e.endDate) >= now); // apenas eventos ativos
      },
      error: (err) => {
        console.error(err);
        alert('Erro ao carregar eventos.');
      },
    });
  }

  isRegistered(eventId: string) {
    return this.registeredEvents.has(eventId);
  }

  register(event: EventModel) {
    this.eventService.registerToEvent(event._id!, this.userId).subscribe({
      next: (res) => {
        // Atualiza o QR Code retornado
        this.registeredQrCodes[event._id!] = res.qrCode || '';

        // Marca este evento como inscrito no Set
        this.registeredEvents.add(event._id!);

        console.log('Inscrição realizada:', res);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
