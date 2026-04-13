// src/types/index.ts
export interface Job {
  id: string;
  batchNumber: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: Date;
  completedAt?: Date;
  subtasks: Subtask[];
}

export interface Subtask {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed';
  expenses: Expense[];
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: Date;
}

export interface Product {
  id: string;
  category: string;
  brand: string;
  model: string;
  tags: string[];
  variants: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  sku: string;
  costPrice: number;
  retailPrice: number;
  barcode: string;
  inventoryItems: InventoryItem[];
}

export interface InventoryItem {
  id: string;
  variantId: string;
  batchNumber: string;
  warehouse: string;
  quantity: number;
  status: 'in_stock' | 'reserved' | 'damaged';
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  type: 'purchase' | 'damaged' | 'reserve';
  variantId: string;
  quantity: number;
  batchNumber: string;
  date: Date;
  customerId?: string;
  notes?: string;
}