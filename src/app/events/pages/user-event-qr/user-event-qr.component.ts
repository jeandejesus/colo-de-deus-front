import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EventService } from '../../../services/event.service';
import { QRCodeComponent } from 'angularx-qrcode';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-user-event-qr',
  standalone: true,
  imports: [CommonModule, RouterModule, QRCodeComponent],
  templateUrl: './user-event-qr.component.html',
  styleUrls: ['./user-event-qr.component.scss'],
})
export class UserEventQRCodeComponent implements OnInit {
  private eventService = inject(EventService);
  private route = inject(ActivatedRoute);

  qrCode: string = '';
  eventTitle: string = '';

  userId = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserFromToken() || '';

    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.loadQRCode(eventId);
    }
  }

  loadQRCode(eventId: string) {
    this.eventService.getUserEventQRCode(eventId, this.userId).subscribe({
      next: (res) => {
        if (res && res.qrCode) {
          this.qrCode = res.qrCode;
          this.eventTitle = res.eventTitle;
        } else {
          alert('Você não está inscrito neste evento.');
        }
      },
      error: (err) => {
        console.error(err);
        alert('Erro ao carregar QR Code.');
      },
    });
  }
}
