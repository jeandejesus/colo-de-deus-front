import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarService } from '../services/calendar.service';
import { ICalendarEvent } from '../interface/calendarEventent.interface';
import { BrowserModule } from '@angular/platform-browser';
import { LoadingScreenComponent } from '../shared/loading-screen/loading-screen.component';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
  standalone: true,
  imports: [BrowserModule, ReactiveFormsModule, LoadingScreenComponent],
})
export class EventFormComponent implements OnInit {
  eventForm!: FormGroup;
  eventId?: string;
  loading = false;
  error = '';

  eventTypes = [
    { value: 'prod', label: 'Prod' },
    { value: 'geral', label: 'Geral' },
    { value: 'local', label: 'Missão local (Curitiba)' },
    { value: 'local_externo', label: 'Missão local (Externo)' },
    { value: 'arquidiocese', label: 'Arquidiocese' },
  ];

  constructor(
    private fb: FormBuilder,
    private calendarService: CalendarService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id') || undefined;

    this.eventForm = this.fb.group({
      summary: ['', Validators.required],
      description: [''],
      start: ['', Validators.required],
      end: ['', Validators.required],
      status: ['confirmado'],
      typeMission: [''],
      location: [''],
    });

    const navState = history.state.event as ICalendarEvent | undefined;
    if (navState) {
      this.eventId = navState.id;
      this.eventForm.patchValue({
        summary: navState.summary,
        description: navState.description,
        start: this.formatDateForInput(
          navState.start.dateTime ?? navState.start.date
        ),
        end: this.formatDateForInput(
          navState.end.dateTime ?? navState.end.date
        ),
        status: navState.statusMongo,
        typeMission: navState.typeMission,
        googleEventId: navState.googleEventId,
        location: navState.location,
      });
    }

    history.replaceState({}, '');
  }

  formatDateForInput(dateStr?: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);

    const pad = (n: number) => String(n).padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    // datetime-local espera "YYYY-MM-DDTHH:mm"
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  submit() {
    if (this.eventForm.invalid) return;

    this.loading = true;
    const formValue = this.eventForm.value as Partial<ICalendarEvent>;

    const { start, end } = this.eventForm.value;
    if (new Date(end) <= new Date(start)) {
      this.error = 'A data de término deve ser maior que a data de início';
      this.loading = false;
      return;
    }

    if (this.eventId) {
      // Atualizar evento
      this.calendarService.updateEvent(this.eventId, formValue).subscribe({
        next: () => {
          this.router.navigate(['/agenda']).then(() => {
            window.location.reload();
          });
        },
        error: (err) => {
          console.error(err);
          this.error = 'Erro ao atualizar evento';
          this.loading = false;
        },
      });
    } else {
      // Criar evento
      this.calendarService.createEvent(formValue).subscribe({
        next: () =>
          this.router.navigate(['/agenda']).then(() => {
            window.location.reload();
          }),
        error: (err) => {
          console.error(err);
          this.error = 'Erro ao criar evento';
          this.loading = false;
        },
      });
    }
  }
}
