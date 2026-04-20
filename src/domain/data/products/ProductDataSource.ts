import type { Product, ProductVariant } from "../../models/product";

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ProductsQueryParams {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  brand?: string;
  tag?: string;
  sortBy?: 'name' | 'brand' | 'model';
  sortOrder?: 'asc' | 'desc';
}
export type CreateOrUpdateProductResponse = {
  product? : Product,
  successful: boolean
}

export interface ProductDataSource{

    getProducts(params: ProductsQueryParams): Promise<ProductsResponse>
    createProduct(product: Omit<Product, 'id'>): Promise<CreateOrUpdateProductResponse>
    createVariant(productId: string, variant: ProductVariant) : Promise<CreateOrUpdateProductResponse>
    updateProduct(id: string, updates: Partial<Product>): Promise<CreateOrUpdateProductResponse>
    deleteProduct(id: string): Promise<void>
    getProductById(id: string): Promise<Product | null>
    getFilterOptions(): Promise<{
        categories: string[];
        brands: string[];
        tags: string[];
      }>

}