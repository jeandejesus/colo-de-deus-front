import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
  standalone: true, // Adicione esta linha se seu componente for standalone
})
export class DateFormatPipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) {
      return '';
    }

    const date = new Date(value);

    // Verifica se a data é válida
    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }

    // toLocaleDateString() é a forma mais segura de formatar datas para diferentes regiões
    return date.toLocaleDateString('pt-BR');
  }
}
