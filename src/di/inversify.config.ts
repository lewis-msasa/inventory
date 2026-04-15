import { Container } from "inversify";
import { TYPES } from "./types";
import "reflect-metadata";
import type { ProductDataSource } from "../domain/data/products/ProductDataSource";
import type { ProductRepository } from "../domain/repositories/products/productRepository";
import { ProductRepositoryImpl } from "../infrastructure/repositories/products/ProductRepositoryImpl";
import { ProductDataSourceMock } from "../infrastructure/datasource/products/ProductDataSourceMock";

const myContainer = new Container();

myContainer.bind<ProductDataSource>(TYPES.ProductDataSource).to(ProductDataSourceMock);
myContainer.bind<ProductRepository>(TYPES.ProductRepository).to(ProductRepositoryImpl);

export {myContainer}