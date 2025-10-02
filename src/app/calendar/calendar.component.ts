// src/app/components/calendar/calendar.component.ts
import { Component, OnInit } from '@angular/core';
import { CalendarService } from '../services/calendar.service';
import { LoadingScreenComponent } from '../shared/loading-screen/loading-screen.component';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { PermissionDirective } from '../directives/permission.directive';
import { AuthService } from '../auth/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

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
    MatButtonModule,
    MatMenuModule,
  ],
})
export class CalendarComponent implements OnInit {
  events: any[] = [];
  loading: boolean = true;
  error = '';
  selectedMonth: number = new Date().getMonth() + 1;
  selectYear: number = new Date().getFullYear();
  viewUserMode: boolean = false;
  tipoView: string = 'Modo Usuario';
  openedEventId: string | null = null;

  eventTypes = [
    { value: 'prod', label: 'Prod', borderColor: '3px solid #ff0e0eff' },
    { value: 'geral', label: 'Geral', borderColor: '3px solid #20d356ff' },
    {
      value: 'local',
      label: 'Missão local (Curitiba)',
      borderColor: '3px solid #095bd6ff',
    },
    {
      value: 'local_externo',
      label: 'Missão local (Externo)',
      borderColor: '3px solid #961a8bff',
    },
    {
      value: 'arquidiocese',
      label: 'Arquidiocese',
      borderColor: '3px solid #ecde19ff',
    },
  ];

  months = [
    { value: 1, name: 'Janeiro' },
    { value: 2, name: 'Fevereiro' },
    { value: 3, name: 'Março' },
    { value: 4, name: 'Abril' },
    { value: 5, name: 'Maio' },
    { value: 6, name: 'Junho' },
    { value: 7, name: 'Julho' },
    { value: 8, name: 'Agosto' },
    { value: 9, name: 'Setembro' },
    { value: 10, name: 'Outubro' },
    { value: 11, name: 'Novembro' },
    { value: 12, name: 'Dezembro' },
  ];
  constructor(
    private calendarService: CalendarService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents() {
    this.loading = true;
    this.error = '';

    this.calendarService
      .getEvents(this.selectedMonth, this.selectYear)
      .subscribe({
        next: (events) => {
          const userRole = this.authService.getRoleFromToken();
          this.openedEventId = null; // Fecha qualquer evento aberto ao carregar novos eventos

          if (userRole === 'membro' || this.viewUserMode) {
            this.events = events.filter(
              (event: any) => event.statusMongo == 'Confirmado'
            );
          } else {
            this.events = events;
          }

          this.loading = false; // ✅ deve ser false
        },
        error: (err) => {
          console.error(err);
          this.error = 'Erro ao carregar eventos';
          this.loading = false;
        },
      });
  }

  // ✅ Método para avançar um mês
  nextMonth(): void {
    // Se for o último mês, avança para o primeiro do próximo ano
    if (this.selectedMonth === 12) {
      this.selectYear++;
      this.selectedMonth = 1;
    } else {
      this.selectedMonth++;
    }
    this.loadEvents();
  }

  previousMonth(): void {
    // Se for o primeiro mês, volta para o último do ano
    if (this.selectedMonth === 1) {
      this.selectedMonth = 12;
      this.selectYear--;
    } else {
      this.selectedMonth--;
    }
    this.loadEvents();
  }

  viewEvent(event: any) {
    this.openedEventId = this.openedEventId === event.id ? null : event.id;
  }

  getEventTypeLabel(value: string): string {
    const type = this.eventTypes.find((t) => t.value === value);
    return type ? type.label : value;
  }

  getBorderColor(event: any): string {
    return (
      this.eventTypes.find((t) => t.value === event.typeMission)?.borderColor ||
      '3px solid #000'
    );
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

  userViewMode(): void {
    this.viewUserMode = !this.viewUserMode;
    this.tipoView = this.viewUserMode ? 'Modo Admin' : 'Modo Usuario';
    this.loadEvents();
  }
}
