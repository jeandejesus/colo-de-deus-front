import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, tap } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class BibleService {
  // cache de observables por nome normalizado — evita requisições duplicadas
  private bookObservables = new Map<string, Observable<any>>();

  constructor(private http: HttpClient) {}

  private normalizeName(name: string): string {
    return (name || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove acentos
      .replace(/\s+/g, ''); // remove espaços
  }

  getBook(bookName: string): Observable<any> {
    const key = this.normalizeName(bookName);
    // se já existe um observable no cache, retorna ele (shareReplay garante reutilização)
    if (this.bookObservables.has(key)) {
      return this.bookObservables.get(key)!;
    }

    const obs$ = this.http.get(`/assets/bible/${key}.json`).pipe(
      // opcional: podemos logar ou transformar aqui
      tap({
        next: () => console.log(`Fetched ${key}`),
        error: (err) => console.error(`Erro ao buscar ${key}`, err),
      }),
      // garante que múltiplos subscribers compartilhem a mesma requisição/resposta
      shareReplay({ bufferSize: 1, refCount: true })
    );

    this.bookObservables.set(key, obs$);
    return obs$;
  }

  getChapter(
    bookName: string,
    chapter: number
  ): Observable<{ nome: string; capitulo: number; versiculos: any[] }> {
    return this.getBook(bookName).pipe(
      map((book: any) => {
        const found = (book?.capitulos || []).find(
          (c: any) => c.capitulo === Number(chapter)
        );
        return {
          nome: book?.nome ?? this.normalizeName(bookName),
          capitulo: chapter,
          versiculos: found?.versiculos || [],
        };
      })
    );
  }
}
