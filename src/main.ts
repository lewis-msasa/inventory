import { myContainer } from "./di/inversify.config";
import "reflect-metadata";
import { TYPES } from "./di/types";
import type { ProductDataSource } from "./domain/data/products/ProductDataSource";
import type { ProductRepository } from "./domain/repositories/products/productRepository";
import type { JobRepository } from "./domain/repositories/jobs/jobRepository";
import type { JobDataSource } from "./domain/data/jobs/JobDataSource";

export const productDataSource= myContainer.get<ProductDataSource>(TYPES.ProductDataSource);
export const productRepository  = myContainer.get<ProductRepository>(TYPES.ProductRepository);
export const jobDataSource= myContainer.get<JobDataSource>(TYPES.JobDataSource);
export const jobRepository  = myContainer.get<JobRepository>(TYPES.JobRepository);