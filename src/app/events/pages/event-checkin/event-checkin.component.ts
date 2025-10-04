import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { EventService } from '../../../services/event.service';
import { BarcodeFormat } from '@zxing/library';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-event-checkin',
  standalone: true,
  imports: [CommonModule, ZXingScannerModule],
  templateUrl: './event-checkin.component.html',
  styleUrls: ['./event-checkin.component.scss'],
})
export class EventCheckinComponent {
  private eventService = inject(EventService);
  private route = inject(ActivatedRoute);

  allowedFormats = [BarcodeFormat.QR_CODE];
  qrResult: string | null = null;
  checkinMessage: string = '';
  loading = false;

  onCodeResult(result: string) {
    this.qrResult = result;
    this.checkin(result);
  }

  checkin(qrCode: string) {
    this.loading = true;
    const eventId = this.route.snapshot.paramMap.get('id');
    if (!eventId) {
      this.checkinMessage = 'ID do evento não fornecido.';
      this.loading = false;
      return;
    }

    this.eventService.checkIn(eventId, qrCode).subscribe({
      next: (res) => {
        this.checkinMessage = 'Check-in realizado com sucesso!';
        this.loading = false;
      },
      error: (err) => {
        this.checkinMessage = err.error?.message || 'Falha ao validar QR Code';
        this.loading = false;
      },
    });
  }
}
