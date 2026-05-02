import { Container } from "inversify";
import { TYPES } from "./types";
import "reflect-metadata";
import type { ProductDataSource } from "../domain/data/products/ProductDataSource";
import type { ProductRepository } from "../domain/repositories/products/productRepository";
import { ProductRepositoryImpl } from "../infrastructure/repositories/products/ProductRepositoryImpl";
import { ProductDataSourceMock } from "../infrastructure/datasource/products/ProductDataSourceMock";
import type { JobDataSource } from "../domain/data/jobs/JobDataSource";
import type { JobRepository } from "../domain/repositories/jobs/jobRepository";
import { JobDataSourceMock } from "../infrastructure/datasource/jobs/JobDataSourceMock";
import { JobRepositoryImpl } from "../infrastructure/repositories/jobs/JobRepositoryImpl";

const myContainer = new Container();

myContainer.bind<ProductDataSource>(TYPES.ProductDataSource).to(ProductDataSourceMock);
myContainer.bind<ProductRepository>(TYPES.ProductRepository).to(ProductRepositoryImpl);


myContainer.bind<JobDataSource>(TYPES.JobDataSource).to(JobDataSourceMock);
myContainer.bind<JobRepository>(TYPES.JobRepository).to(JobRepositoryImpl);

export {myContainer}