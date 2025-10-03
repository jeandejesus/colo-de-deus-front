import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EventService, EventModel } from '../../../services/event.service';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
})
export class EventListComponent implements OnInit {
  private eventService = inject(EventService);
  private router = inject(Router);

  events: EventModel[] = [];

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents() {
    this.eventService.getEvents().subscribe({
      next: (res) => (this.events = res),
      error: (err) => {
        console.error(err);
        alert('Erro ao carregar eventos.');
      },
    });
  }

  editEvent(id: string) {
    this.router.navigate(['/events/edit', id]);
  }

  deleteEvent(id: string) {
    if (!confirm('Deseja realmente excluir este evento?')) return;

    this.eventService.deleteEvent(id).subscribe({
      next: () => this.loadEvents(),
      error: (err) => {
        console.error(err);
        alert('Erro ao excluir evento.');
      },
    });
  }
}
