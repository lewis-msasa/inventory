import { injectable } from "inversify";
import type { CreateOrUpdateProductResponse, ProductDataSource, ProductsQueryParams, ProductsResponse } from "../../../domain/data/products/ProductDataSource";
import type { Product, ProductVariant } from "../../../domain/models/product";

@injectable()
export class ProductDataSourceImpl implements ProductDataSource{
    createVariant(productId: string, variant: ProductVariant): Promise<CreateOrUpdateProductResponse> {
        throw new Error("Method not implemented.");
    }
    getProducts(params: ProductsQueryParams): Promise<ProductsResponse> {
        throw new Error("Method not implemented.");
    }
    createProduct(product: Omit<Product, "id">): Promise<CreateOrUpdateProductResponse> {
        throw new Error("Method not implemented.");
    }
    updateProduct(id: string, updates: Partial<Product>): Promise<CreateOrUpdateProductResponse> {
        throw new Error("Method not implemented.");
    }
    deleteProduct(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getProductById(id: string): Promise<Product | null> {
        throw new Error("Method not implemented.");
    }
    getFilterOptions(): Promise<{
        categories: string[];
        brands: string[];
        tags: string[];
      }>{
        throw new Error("")
      }

}