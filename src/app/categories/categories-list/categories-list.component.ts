// src/app/categories/categories-list/categories-list.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../model/categories.model';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.scss',
})
export class CategoriesListComponent implements OnInit {
  categories: Category[] = []; // ⬅️ Usa o tipo Category[]

  constructor(private categoriesService: CategoriesService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoriesService.findAll().subscribe(
      (data) => (this.categories = [...data]),
      (error) => console.error(error)
    );
  }

  deleteCategory(id: string): void {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      this.categoriesService.remove(id).subscribe(
        () => {
          console.log('Categoria excluída com sucesso!');
          this.loadCategories(); // Recarrega a lista
        },
        (error) => console.error('Erro ao excluir categoria:', error)
      );
    }
  }
}
