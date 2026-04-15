import { myContainer } from "./di/inversify.config";
import "reflect-metadata";
import { TYPES } from "./di/types";
import type { ProductDataSource } from "./domain/data/products/ProductDataSource";
import type { ProductRepository } from "./domain/repositories/products/productRepository";

export const productDataSource= myContainer.get<ProductDataSource>(TYPES.ProductDataSource);
export const productRepository  = myContainer.get<ProductRepository>(TYPES.ProductRepository);