import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Liturgia, LiturgiaService } from '../services/liturgia.service';
import { LoadingScreenComponent } from '../shared/loading-screen/loading-screen.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-liturgia',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    LoadingScreenComponent,
    MatIconModule,
  ],
  templateUrl: './liturgia.component.html',
  styleUrls: ['./liturgia.component.scss'],
})
export class LiturgiaComponent implements OnInit {
  liturgia: Liturgia | null = null;
  loading = true;

  constructor(private liturgiaService: LiturgiaService) {}

  ngOnInit() {
    this.liturgiaService.getToday().subscribe({
      next: (data) => {
        const formatText = (text?: string, isSalmo = false) => {
          if (!text) return '';
          let formatted = text
            .replace(/\n/g, '<br><br>')
            .replace(/\b(\d+[a-z]?)\b/g, '<strong>$1</strong>');
          if (isSalmo) formatted = `<em>${formatted}</em>`;
          return formatted;
        };

        this.liturgia = {
          ...data,
          primeira_leitura: formatText(data.primeira_leitura),
          salmo: formatText(data.salmo, true),
          segunda_leitura: formatText(data.segunda_leitura),
          evangelho: formatText(data.evangelho),
          reflexao: data.reflexao, // adiciona a reflexão se tiver
        };

        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar liturgia', err);
        this.liturgia = null;
        this.loading = false;
      },
    });
  }
}
