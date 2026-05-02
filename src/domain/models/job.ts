import type { Product, ProductVariant } from "./product";

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

export interface JobProduct {
  id: string;
  productId?: string;
  product?: Product;
  newProduct?: Omit<Product, 'id'>;
  variantId?: string;
  newVariant?: Omit<ProductVariant, 'id'>;
  quantity: number;
  variantCost: number;
  variantRetailCost: number;
  status: 'pending' | 'in_inventory' | 'damaged' | 'discarded';
  qualityCheck?: {
    passed: number;        // Quantity that passed quality check
    failed: number;       // Quantity that failed (to be discarded)
    notes?: string;       // Notes about quality issues
    checkedAt?: Date;     // When the check was performed
    checkedBy?: string;   // Who performed the check
  };
  notes?: string;
}
export interface DamagedItem {
  id: string;
  jobId: string;
  batchNumber: string;
  productId: string;
  variantId: string;
  quantity: number;
  reason: string;
  notes?: string;
  createdAt: Date;
  disposedAt?: Date;
}

export interface Job {
  id: string;
  batchNumber: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: Date;
  completedAt?: Date;
  subtasks: Subtask[];
  products: JobProduct[]; // Add products to job
  warehouse?: string; // Default warehouse for this job's products
}
