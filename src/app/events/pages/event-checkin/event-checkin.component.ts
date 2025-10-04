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

    // 🔥 Extrair o ID do evento da URL escaneada
    const eventId = this.extractEventId(result);

    if (eventId) {
      this.checkin(eventId, result);
    } else {
      this.checkinMessage = 'QR Code inválido';
    }
  }

  private extractEventId(url: string): string | null {
    try {
      const u = new URL(url);
      // caminho: /events/my-event/:id/qr
      const parts = u.pathname.split('/');
      // exemplo: ["", "events", "my-event", "68e08ccff23bd961e6dc3523", "qr"]
      return parts[3] || null;
    } catch {
      return null;
    }
  }

  checkin(eventId: string, qrCode: string) {
    this.loading = true;

    this.eventService.checkIn(eventId, qrCode).subscribe({
      next: () => {
        this.checkinMessage = '✅ Check-in realizado com sucesso!';
        this.loading = false;
      },
      error: (err) => {
        this.checkinMessage =
          err.error?.message || '❌ Falha ao validar QR Code';
        this.loading = false;
      },
    });
  }
}
