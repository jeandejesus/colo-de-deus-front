// src/app/categories/category.model.ts

export enum CategoryType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export interface Category {
  _id: string;
  name: string;
  type: CategoryType;
}
