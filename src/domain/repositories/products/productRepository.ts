import type { Product } from "../../../types"
import type { CreateOrUpdateProductResponse, ProductsQueryParams, ProductsResponse } from "../../data/products/ProductDataSource"
import type { ProductVariant } from "../../models/product"

export interface ProductRepository{
    
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