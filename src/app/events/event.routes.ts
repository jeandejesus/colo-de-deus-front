import { Routes } from '@angular/router';
import { EventListComponent } from './pages/event-list/event-list.component';
import { EventDetailComponent } from './pages/event-detail/event-detail.component';
import { EventFormComponent } from './pages/event-form/event-form.component';
import { UserEventListComponent } from './pages/user-event-list/user-event-list.component';
import { UserEventQRCodeComponent } from './pages/user-event-qr/user-event-qr.component';
import { EventCheckinComponent } from './pages/event-checkin/event-checkin.component';
import { EventRegistrationsComponent } from './pages/event-registrations/event-registrations.component';

export const EVENT_ROUTES: Routes = [
  { path: '', component: EventListComponent },
  { path: 'list', component: UserEventListComponent },
  { path: 'my-event/:id/qr', component: UserEventQRCodeComponent },
  { path: 'checkin/:id', component: EventCheckinComponent },
  { path: 'my-event/:id/participants', component: EventRegistrationsComponent },
  { path: 'create', component: EventFormComponent },
  { path: 'edit/:id', component: EventFormComponent },
  { path: ':id', component: EventDetailComponent }, // genérica SEMPRE por último
];
