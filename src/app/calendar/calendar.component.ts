// src/app/components/calendar/calendar.component.ts
import { Component, OnInit } from '@angular/core';
import { CalendarService } from '../services/calendar.service';
import { LoadingScreenComponent } from '../shared/loading-screen/loading-screen.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: true,
  imports: [CommonModule, LoadingScreenComponent],
})
export class CalendarComponent implements OnInit {
  events: any[] = [];
  loading: boolean = true;
  error = '';

  constructor(private calendarService: CalendarService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents() {
    this.loading = true;
    this.error = '';

    this.calendarService.getEvents().subscribe({
      next: (events) => {
        this.events = events;
        console.log(events);
        this.loading = false; // ✅ deve ser false
      },
      error: (err) => {
        console.error(err);
        this.error = 'Erro ao carregar eventos';
        this.loading = false;
      },
    });
  }

  getBorderColor(event: any): string {
    if (!event.summary) return '3px solid #ccc'; // borda padrão
    if (event.summary.toLowerCase().includes('prod'))
      return '3px solid rgb(3 148 77)'; // vermelho claro
    if (event.summary.toLowerCase().includes('geral'))
      return '3px solid rgb(180 101 101)';
    return '3px solid rgb(105 101 180)'; // azul claro
  }
}
