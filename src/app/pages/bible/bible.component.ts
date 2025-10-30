import { Component, OnInit } from '@angular/core';
import { BibleService } from '../../services/bible.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-bible',
  templateUrl: './bible.component.html',
  styleUrls: ['./bible.component.scss'],
  imports: [BrowserModule, FormsModule, HttpClientModule],
})
export class BibleComponent implements OnInit {
  books: string[] = [
    'Genesis',
    'Exodo',
    'Levitico',
    'Numeros',
    'Deuteronomio',
    'Josue',
    'Juizes',
    'Rute',
    '1Samuel',
    '2Samuel',
    '1Reis',
    '2Reis',
    '1Cronicas',
    '2Cronicas',
    'Esdras',
    'Neemias',
    'Ester',
    'Jo',
    'Salmos',
    'Proverbios',
    'Eclesiastes',
    'Cantico',
    'Isaias',
    'Jeremias',
    'Lamentacoes',
    'Ezequiel',
    'Daniel',
    'Oseias',
    'Joel',
    'Amos',
    'Abdias',
    'Jonas',
    'Miqueias',
    'Naum',
    'Habacuque',
    'Sofonias',
    'Ageu',
    'Zacarias',
    'Malaquias',
    'Mateus',
    'Marcos',
    'Lucas',
    'Joao',
    'Atos',
    'Romanos',
    '1Corintios',
    '2Corintios',
    'Galatas',
    'Efesios',
    'Filipenses',
    'Colossenses',
    '1Tessalonicenses',
    '2Tessalonicenses',
    '1Timoteo',
    '2Timoteo',
    'Tito',
    'Filemon',
    'Hebreus',
    'Tiago',
    '1Pedro',
    '2Pedro',
    '1Joao',
    '2Joao',
    '3Joao',
    'Judas',
    'Apocalipse',
  ];
  selectedBook = 'Genesis';
  selectedChapter = 1;
  chapters: number[] = [];
  verses: { versiculo: number; texto: string }[] = [];

  constructor(private bible: BibleService) {}

  ngOnInit() {
    this.loadBook(this.selectedBook);
  }

  loadBook(bookName: string) {
    this.bible.getBook(bookName).subscribe((book) => {
      this.chapters = book.capitulos.map((c: any) => c.capitulo);
      this.loadChapter(1);
    });
  }

  loadChapter(chapter: number) {
    this.selectedChapter = chapter;
    this.bible.getChapter(this.selectedBook, chapter).subscribe((ch) => {
      this.verses = ch.versiculos;
    });
  }
}
