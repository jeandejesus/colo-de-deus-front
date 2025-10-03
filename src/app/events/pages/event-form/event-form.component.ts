import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EventModel, EventService } from '../../../services/event.service';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
})
export class EventFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private eventService = inject(EventService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  eventForm!: FormGroup;
  eventId?: string;
  isEditMode = false;

  ngOnInit(): void {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      location: ['', Validators.required],
    });

    this.eventId = this.route.snapshot.paramMap.get('id') || undefined;
    this.isEditMode = !!this.eventId;

    if (this.isEditMode && this.eventId) {
      this.loadEvent(this.eventId);
    }
  }

  loadEvent(id: string) {
    this.eventService.getEventById(id).subscribe({
      next: (event) => {
        this.eventForm.patchValue(event);
      },
      error: (err) => {
        console.error(err);
        alert('Erro ao carregar evento.');
      },
    });
  }

  onSubmit() {
    if (this.eventForm.invalid) return;

    const event: EventModel = this.eventForm.value;

    if (this.isEditMode && this.eventId) {
      // 🔹 Atualizar
      this.eventService.updateEvent(this.eventId, event).subscribe({
        next: () => {
          alert('Evento atualizado com sucesso!');
          this.router.navigate(['/events']);
        },
        error: (err) => {
          console.error(err);
          alert('Erro ao atualizar evento.');
        },
      });
    } else {
      // 🔹 Criar
      this.eventService.createEvent(event).subscribe({
        next: () => {
          alert('Evento criado com sucesso!');
          this.router.navigate(['/events']);
        },
        error: (err) => {
          console.error(err);
          alert('Erro ao criar evento.');
        },
      });
    }
  }
}
