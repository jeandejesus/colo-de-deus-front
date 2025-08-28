// src/app/categories/category-type.pipe.ts

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categoryType',
  standalone: true,
})
export class CategoryTypePipe implements PipeTransform {
  transform(value: string): string {
    if (value === 'income') {
      return 'Receita';
    } else if (value === 'expense') {
      return 'Despesa';
    }
    return value; // Retorna o valor original caso não haja correspondência
  }
}
