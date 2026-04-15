export type Product =  {
  id: string;
  category: string;
  name?: string;
  brand: string;
  model: string;
  tags: string[];
  variants: ProductVariant[];
}

export type ProductVariant = {
  id: string;
  size: string;
  color: string;
  sku: string;
  costPrice: number;
  retailPrice: number;
  barcode: string;
  inventoryItems: InventoryItem[];
}

export type InventoryItem = {
  id: string;
  variantId: string;
  batchNumber: string;
  warehouse: string;
  quantity: number;
  status: 'in_stock' | 'reserved' | 'damaged';
  createdAt: Date;
  updatedAt: Date;
}
