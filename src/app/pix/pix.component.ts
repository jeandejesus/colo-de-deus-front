import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatDivider } from '@angular/material/divider';
import { QRCodeComponent } from 'angularx-qrcode';

export interface PixInfo {
  holderName: string; // nome do favorecido
  taxId?: string; // CPF ou CNPJ (opcional)
  key: string; // chave pix (e-mail, celular, aleatória, etc.)
  keyType?: string; // tipo da chave: "CPF", "E-mail", "Celular", "Aleatória"
  amount?: number; // valor em reais (opcional)
  message?: string; // observação/pedido (opcional)
}

@Component({
  selector: 'app-pix',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDivider,
    QRCodeComponent,
  ],
  templateUrl: './pix.component.html',
  styleUrl: './pix.component.scss',
})
export class PixComponent implements OnInit {
  pixInfo!: PixInfo;
  brCode = '';
  showQr = false;

  constructor(private clipboard: Clipboard, private snack: MatSnackBar) {}

  ngOnInit(): void {
    this.pixInfo = {
      holderName: 'Colo de Deus Curitiba',
      taxId: 'Lucineia Silva Henrique de Almeida', // Exemplo de CPF
      key: 'neia_shenrique@hotmail.com',
    };

    this.brCode = this.buildPixBrCode({
      holderName: this.pixInfo.holderName,
      key: this.pixInfo.key,
    });
  }

  copy(text?: string | null, label = 'Copiado') {
    if (!text) {
      this.snack.open('Nada para copiar', 'Fechar', { duration: 2000 });
      return;
    }
    this.clipboard.copy(text);
    this.snack.open(label, undefined, { duration: 2000 });
  }

  toggleQr() {
    this.showQr = !this.showQr;
  }

  private tlv(id: string, value: string) {
    const len = value.length.toString().padStart(2, '0');
    return `${id}${len}${value}`;
  }

  private buildPixBrCode(data: {
    holderName: string;
    key: string;
    amount?: number;
    message?: string;
  }) {
    const tlv = this.tlv.bind(this);

    const payloadFormatIndicator = tlv('00', '01');

    const gui = tlv('00', 'BR.GOV.BCB.PIX');
    const key = tlv('01', data.key || '');
    const merchantAccountInfo = tlv('26', `${gui}${key}`);

    const mcc = tlv('52', '0000');
    const currency = tlv('53', '986');
    const amount = data.amount ? tlv('54', data.amount.toFixed(2)) : '';
    const country = tlv('58', 'BR');
    const merchantName = tlv('59', (data.holderName || '').slice(0, 25));
    const merchantCity = tlv('60', 'CURITIBA');

    // txid precisa estar dentro de 62
    const txid = tlv('05', data.message || '***');
    const additionalData = tlv('62', txid);

    const partial = `${payloadFormatIndicator}${merchantAccountInfo}${mcc}${currency}${amount}${country}${merchantName}${merchantCity}${additionalData}`;

    // CRC é sempre campo fixo 6304 + valor
    const crcInput = `${partial}6304`;
    const crc = this.computeCrc16(crcInput);

    return `${partial}6304${crc}`;
  }

  // CRC-16/CCITT-FALSE (retorna 4 hex chars)
  private computeCrc16(input: string): string {
    // NÃO usa Buffer no browser — usar array de códigos UTF-8
    const encoder = new TextEncoder();
    const bytes = encoder.encode(input);
    let crc = 0xffff;
    for (let b = 0; b < bytes.length; b++) {
      crc ^= (bytes[b] << 8) & 0xffff;
      for (let i = 0; i < 8; i++) {
        crc =
          crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
      }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
  }
}
