import { inject, injectable } from "inversify";
import { TYPES } from "../../../di/types";
import type { CreateOrUpdateProductResponse, ProductDataSource, ProductsQueryParams, ProductsResponse } from "../../../domain/data/products/ProductDataSource";
import type { ProductRepository } from "../../../domain/repositories/products/productRepository";
import type { Product } from "../../../types";
import type { ProductVariant } from "../../../domain/models/product";


@injectable()
export class ProductRepositoryImpl implements ProductRepository{
    private _dataSource : ProductDataSource;
  
    public constructor(
        @inject(TYPES.ProductDataSource) dataSource : ProductDataSource
    ){
        this._dataSource = dataSource
    }
    createVariant(productId: string, variant: ProductVariant): Promise<CreateOrUpdateProductResponse> {
        return this._dataSource.createVariant(productId,variant);
    }
    getProducts(params: ProductsQueryParams): Promise<ProductsResponse> {
        return this._dataSource.getProducts(params)
    
    }
    createProduct(product: Omit<Product, "id">): Promise<CreateOrUpdateProductResponse> {
        return this._dataSource.createProduct(product);
    }
    updateProduct(id: string, updates: Partial<Product>): Promise<CreateOrUpdateProductResponse> {
        return this._dataSource.updateProduct(id,updates);
    }
    deleteProduct(id: string): Promise<void> {
        return this._dataSource.deleteProduct(id);
    }
    getProductById(id: string): Promise<Product | null> {
        return this._dataSource.getProductById(id);
    }
    getFilterOptions(): Promise<{
        categories: string[];
        brands: string[];
        tags: string[];
      }>{
        return this._dataSource.getFilterOptions();
      }

}