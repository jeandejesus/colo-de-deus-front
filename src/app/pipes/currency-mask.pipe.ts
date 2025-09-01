import { Pipe, PipeTransform } from '@angular/core';

type CentsMode = 'auto' | 'always' | 'never';

@Pipe({ name: 'currencyMask', standalone: true })
export class CurrencyMaskPipe implements PipeTransform {
  /**
   * @param value           string ou number (pode vir com "R$", "." e ",")
   * @param showSymbol      mostra "R$"? (default: true)
   * @param centsMode       'auto' = mostra centavos só se houver; 'always' = sempre 2; 'never' = nenhum (default: 'auto')
   * @param inputIsCents    se true, valor é em centavos (ex: 410000 -> R$ 4.100,00) (default: false)
   */
  transform(
    value: string | number,
    showSymbol: boolean = true,
    centsMode: CentsMode = 'auto',
    inputIsCents: boolean = false
  ): string {
    if (value === null || value === undefined || value === '') return '';

    // Normaliza string para número:
    // - remove "R$", espaços e separadores de milhar
    // - troca vírgula decimal por ponto
    let str = String(value)
      .trim()
      .replace(/[R$\s]/g, '')
      .replace(/\./g, '')
      .replace(',', '.');

    let num = Number(str);
    if (Number.isNaN(num)) return '';

    if (inputIsCents) num = num / 100;

    const hasDecimals = Math.round(num * 100) % 100 !== 0;

    const minimumFractionDigits =
      centsMode === 'always'
        ? 2
        : centsMode === 'never'
        ? 0
        : hasDecimals
        ? 2
        : 0;

    const maximumFractionDigits = minimumFractionDigits;

    const options: Intl.NumberFormatOptions = {
      minimumFractionDigits,
      maximumFractionDigits,
    };

    if (showSymbol) {
      options.style = 'currency';
      options.currency = 'BRL';
    }

    const formatted = new Intl.NumberFormat('pt-BR', options).format(num);
    return showSymbol ? formatted : formatted.replace(/^R\$\s?/, '');
  }
}
