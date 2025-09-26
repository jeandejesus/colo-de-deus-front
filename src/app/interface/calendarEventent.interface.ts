export interface ICalendarEvent {
  id?: string; // ID interno do evento
  googleEventId: string; // ID do evento no Google Calendar
  summary: string; // Título do evento
  description?: string; // Descrição do evento
  start: {
    dateTime?: string; // Horário de início (ISO string)
    date?: string; // Caso seja evento o dia todo
  };
  end: {
    dateTime?: string; // Horário de término (ISO string)
    date?: string; // Caso seja evento o dia todo
  };
  statusMongo?: string; // Ex.: "confirmado"
  typeMission?: string; // Tipo do evento
  colorId?: string; // ID de cor do Google Calendar
  location?: string; // Local do evento
}
