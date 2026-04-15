import type { Product } from "../../models/product";

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

export interface ProductDataSource{

    getProducts(params: ProductsQueryParams): Promise<ProductsResponse>
    createProduct(product: Omit<Product, 'id'>): Promise<Product>
    updateProduct(id: string, updates: Partial<Product>): Promise<Product>
    deleteProduct(id: string): Promise<void>
    getProductById(id: string): Promise<Product | null>
    getFilterOptions(): Promise<{
        categories: string[];
        brands: string[];
        tags: string[];
      }>

}