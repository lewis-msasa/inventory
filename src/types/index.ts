

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
  newProduct?: Omit<Product, 'id'>;
  variantId?: string;
  newVariant?: Omit<ProductVariant, 'id'>;
  quantity: number;
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

// Add this for tracking inventory entries
export interface InventoryEntry {
  id: string;
  jobId: string;
  batchNumber: string;
  productId: string;
  variantId: string;
  quantity: number;
  warehouse: string;
  createdAt: Date;
  status: 'active' | 'damaged' | 'sold';
}





















export interface Product {
  id: string;
  category: string;
  name?: string;
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