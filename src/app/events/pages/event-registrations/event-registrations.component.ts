import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SocketService } from '../../../services/socket.service';
import { EventService } from '../../../services/event.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  standalone: true,
  selector: 'app-event-registrations',
  templateUrl: './event-registrations.component.html',
  styleUrls: ['./event-registrations.component.scss'],
})
export class EventRegistrationsComponent implements OnInit, OnDestroy {
  eventId!: string;
  participants: any[] = [];
  private sub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private socketService: SocketService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id')!;

    this.socketService.connect(); // URL do backend
    this.socketService.joinEvent(this.eventId);

    this.loadParticipants();

    this.sub = this.socketService.onParticipantsUpdate().subscribe((data) => {
      console.log('Atualização recebida via WebSocket:', data);
      this.participants = data;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  loadParticipants() {
    this.eventService.getParticipants(this.eventId).subscribe((res) => {
      this.participants = res;
    });
  }
}
