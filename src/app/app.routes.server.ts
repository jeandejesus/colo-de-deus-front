import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'agenda',
    renderMode: RenderMode.Client, // força renderização no cliente
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
