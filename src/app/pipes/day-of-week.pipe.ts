// src/app/pipes/day-of-week.pipe.ts

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dayOfWeek',
  standalone: true,
})
export class DayOfWeekPipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) {
      return '';
    }

    let date: Date;
    // Converte a string "DD/MM/YYYY" para um objeto Date
    if (typeof value === 'string') {
      const [day, month, year] = value.split('/').map(Number);
      date = new Date(year, month - 1, day);
    } else {
      date = value;
    }

    const dayOfWeek = date.getDay(); // 0 = Domingo, 1 = Segunda, ...
    const dayOfMonth = date.getDate(); // ✅ Pega o dia do mês (ex: 29)

    switch (dayOfWeek) {
      case 0:
        return `Domingo, ${dayOfMonth}`;
      case 1:
        return `Segunda-feira, ${dayOfMonth}`;
      case 2:
        return `Terça-feira, ${dayOfMonth}`;
      case 3:
        return `Quarta-feira, ${dayOfMonth}`;
      case 4:
        return `Quinta-feira, ${dayOfMonth}`;
      case 5:
        return `Sexta-feira, ${dayOfMonth}`;
      case 6:
        return `Sábado, ${dayOfMonth}`;
      default:
        return '';
    }
  }
}
