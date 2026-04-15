import { inject, injectable } from "inversify";
import { TYPES } from "../../../di/types";
import type { ProductDataSource, ProductsQueryParams, ProductsResponse } from "../../../domain/data/products/ProductDataSource";
import type { ProductRepository } from "../../../domain/repositories/products/productRepository";
import type { Product } from "../../../types";


@injectable()
export class ProductRepositoryImpl implements ProductRepository{
    private _dataSource : ProductDataSource;
  
    public constructor(
        @inject(TYPES.ProductDataSource) dataSource : ProductDataSource
    ){
        this._dataSource = dataSource
    }
    getProducts(params: ProductsQueryParams): Promise<ProductsResponse> {
        return this._dataSource.getProducts(params)
    
    }
    createProduct(product: Omit<Product, "id">): Promise<Product> {
        return this._dataSource.createProduct(product);
    }
    updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
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