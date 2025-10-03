import { QRCodeComponent } from 'angularx-qrcode';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventModel, EventService } from '../../../services/event.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-event-register',
  standalone: true,
  imports: [CommonModule, QRCodeComponent], // CORRETO: QRCodeComponent mesmo
  templateUrl: './event-register.component.html',
  styleUrls: ['./event-register.component.scss'],
})
export class EventRegisterComponent implements OnInit {
  private eventService = inject(EventService);
  private route = inject(ActivatedRoute);

  event?: EventModel;
  qrCode: string = '';

  userId = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserFromToken() || '';

    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.loadEvent(eventId);
    }
  }

  loadEvent(id: string) {
    this.eventService.getEventById(id).subscribe({
      next: (res) => (this.event = res),
      error: (err) => {
        console.error(err);
        alert('Erro ao carregar evento.');
      },
    });
  }

  register() {
    if (!this.event) return;

    this.eventService.registerToEvent(this.event._id!, this.userId).subscribe({
      next: (res) => {
        this.qrCode = res.qrCode || '';
        alert('Inscrição realizada com sucesso!');
      },
      error: (err) => {
        console.error(err);
        alert('Erro ao se inscrever no evento.');
      },
    });
  }
}
