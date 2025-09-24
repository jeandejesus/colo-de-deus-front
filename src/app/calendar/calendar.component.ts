// src/app/components/calendar/calendar.component.ts
import { Component, OnInit } from '@angular/core';
import { CalendarService } from '../services/calendar.service';
import { LoadingScreenComponent } from '../shared/loading-screen/loading-screen.component';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { PermissionDirective } from '../directives/permission.directive';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: true,
  imports: [
    PermissionDirective,
    CommonModule,
    LoadingScreenComponent,
    MatIcon,
    RouterLink,
  ],
})
export class CalendarComponent implements OnInit {
  events: any[] = [];
  loading: boolean = true;
  error = '';

  constructor(
    private calendarService: CalendarService,
    private router: Router
  ) {}

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
    console.log('Status do evento:', event.status);
    if (!event.typeMission) return '3px solid #ccc'; // borda padrão
    if (event.typeMission.toLowerCase().includes('prod'))
      return '3px solid rgb(3 148 77)'; // vermelho claro
    if (event.typeMission.toLowerCase().includes('geral'))
      return '3px solid rgb(180 101 101)';
    return '3px solid rgb(105 101 180)'; // azul claro
  }

  editEvent(event: any) {
    this.router.navigate(['/agenda/event'], { state: { event } });
  }

  deleteEvent(event: any) {
    if (!confirm(`Deseja realmente deletar o evento "${event.summary}"?`))
      return;

    console.log('Deletando evento:', event);

    this.calendarService.deleteEvent(event.id).subscribe({
      next: () => this.loadEvents(), // recarrega a lista
      error: (err) => console.error('Erro ao deletar:', err),
    });
  }
}
