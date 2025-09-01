// src/main.ts

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js') // Certifique-se de que esse caminho está correto e o arquivo existe na pasta dist
    .then(() => console.log('sw.js registrado com sucesso'))
    .catch((err) => console.error('Erro ao registrar sw.js:', err));
}
