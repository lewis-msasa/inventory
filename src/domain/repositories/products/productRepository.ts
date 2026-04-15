import type { Product } from "../../../types"
import type { ProductsQueryParams, ProductsResponse } from "../../data/products/ProductDataSource"

export interface ProductRepository{
    
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