import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { EventService } from '../../../services/event.service';
import { BarcodeFormat } from '@zxing/library';

@Component({
  selector: 'app-event-checkin',
  standalone: true,
  imports: [CommonModule, ZXingScannerModule],
  templateUrl: './event-checkin.component.html',
  styleUrls: ['./event-checkin.component.scss'],
})
export class EventCheckinComponent {
  private eventService = inject(EventService);
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
    // supondo que você tenha o ID do evento fixo ou passado via rota
    const eventId = 'ID_DO_EVENTO';

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
