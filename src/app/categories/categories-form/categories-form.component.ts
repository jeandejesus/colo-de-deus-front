// src/app/categories/categories-form/categories-form.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from '../../services/categories.service';
import { CategoryType } from '../model/categories.model';
import { CategoryTypePipe } from '../../pipes/category-type.pipe';

@Component({
  selector: 'app-categories-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CategoryTypePipe],
  templateUrl: './categories-form.component.html',
  styleUrl: './categories-form.component.scss',
})
export class CategoriesFormComponent implements OnInit {
  categoryForm!: FormGroup;
  isEditing = false;
  itemId: string | null = null;
  categoryTypes = Object.values(CategoryType); // [ 'income', 'expense' ]

  constructor(
    private fb: FormBuilder,
    private categoriesService: CategoriesService,
    public router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      type: [null, Validators.required],
    });

    this.itemId = this.route.snapshot.paramMap.get('id');
    if (this.itemId) {
      this.isEditing = true;
      this.categoriesService.findOne(this.itemId).subscribe({
        next: (data) => {
          this.categoryForm.patchValue(data);
        },
        error: (err) => {
          console.error('Erro ao carregar categoria:', err);
        },
      });
    }
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      if (this.isEditing && this.itemId) {
        this.categoriesService
          .update(this.itemId, this.categoryForm.value)
          .subscribe({
            next: () => {
              this.router.navigate(['/categories']);
            },
            error: (err) => {
              console.error('Erro ao atualizar categoria:', err);
            },
          });
      } else {
        this.categoriesService.create(this.categoryForm.value).subscribe({
          next: () => {
            this.router.navigate(['/categories']);
          },
          error: (err) => {
            console.error('Erro ao adicionar categoria:', err);
          },
        });
      }
    }
  }
}
