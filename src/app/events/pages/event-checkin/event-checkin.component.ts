import { Component, inject, OnInit } from '@angular/core';
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
export class EventCheckinComponent implements OnInit {
  ngOnInit(): void {
    this.checkin('a31626e6-db6c-4580-ab09-412e0630934b');
  }
  private eventService = inject(EventService);
  private route = inject(ActivatedRoute);

  allowedFormats = [BarcodeFormat.QR_CODE];
  qrResult: string | null = null;
  checkinMessage: string = '';
  loading = false;
  checkinValidado = false;

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
        this.checkinValidado = true;
      },
      error: (err) => {
        this.checkinMessage = err.error?.messages || 'Falha ao validar QR Code';
        this.loading = false;
      },
    });
  }
}
