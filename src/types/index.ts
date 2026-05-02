


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