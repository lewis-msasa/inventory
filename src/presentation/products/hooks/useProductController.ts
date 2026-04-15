// src/hooks/useProducts.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import type { Product } from '../../../domain/models/product';
import type { ProductsQueryParams, ProductsResponse } from '../../../domain/data/products/ProductDataSource';
import type { ProductRepository } from '../../../domain/repositories/products/productRepository';

interface UseProductsOptions {
  initialPage?: number;
  limit?: number;
  search?: string;
  category?: string;
  brand?: string;
  tag?: string;
  sortBy?: 'name' | 'brand' | 'model';
  sortOrder?: 'asc' | 'desc';
  enableInfiniteScroll?: boolean;
}

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  total: number;
  page: number;
  totalPages: number;
  loadMore: () => void;
  refresh: () => void;
  updateFilters: (filters: Partial<Omit<UseProductsOptions, 'initialPage' | 'limit' | 'enableInfiniteScroll'>>) => void;
  isFetching: boolean;
}

export const useProductController = (options: UseProductsOptions = {}, repo: ProductRepository) => {
  const {
    initialPage = 1,
    limit = 10,
    search = '',
    category = 'all',
    brand = 'all',
    tag = 'all',
    sortBy = 'name',
    sortOrder = 'asc',
    enableInfiniteScroll = true
  } = options;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  
  const currentFiltersRef = useRef({ search, category, brand, tag, sortBy, sortOrder });
  const isInitialMount = useRef(true);

  const fetchProducts = useCallback(async (pageNum: number, append = false) => {
    if (isFetching) return;
    
    setIsFetching(true);
    setLoading(true);
    setError(null);

    try {
      const params: ProductsQueryParams = {
        page: pageNum,
        limit,
        search: currentFiltersRef.current.search || undefined,
        category: currentFiltersRef.current.category !== 'all' ? currentFiltersRef.current.category : undefined,
        brand: currentFiltersRef.current.brand !== 'all' ? currentFiltersRef.current.brand : undefined,
        tag: currentFiltersRef.current.tag !== 'all' ? currentFiltersRef.current.tag : undefined,
        sortBy: currentFiltersRef.current.sortBy,
        sortOrder: currentFiltersRef.current.sortOrder
      };

      const response: ProductsResponse = await repo.getProducts(params);
      
      if (append) {
        setProducts(prev => [...prev, ...response.products]);
      } else {
        setProducts(response.products);
      }
      
      setHasMore(response.hasMore);
      setTotal(response.total);
      setTotalPages(response.totalPages);
      setPage(response.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  }, [limit, isFetching]);

  // Reset and fetch when filters change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      fetchProducts(1, false);
      return;
    }

    // Reset pagination when filters change
    setProducts([]);
    setPage(1);
    fetchProducts(1, false);
  }, [search, category, brand, tag, sortBy, sortOrder]);

  // Update refs when filters change
  useEffect(() => {
    currentFiltersRef.current = { search, category, brand, tag, sortBy, sortOrder };
  }, [search, category, brand, tag, sortBy, sortOrder]);

  const loadMore = useCallback(() => {
    if (!enableInfiniteScroll) return;
    if (!hasMore || loading || isFetching) return;
    
    const nextPage = page + 1;
    if (nextPage <= totalPages) {
      fetchProducts(nextPage, true);
    }
  }, [hasMore, loading, isFetching, page, totalPages, enableInfiniteScroll, fetchProducts]);

  const refresh = useCallback(() => {
    setProducts([]);
    setPage(1);
    fetchProducts(1, false);
  }, [fetchProducts]);

  const updateFilters = useCallback((newFilters: Partial<Omit<UseProductsOptions, 'initialPage' | 'limit' | 'enableInfiniteScroll'>>) => {
    // This will trigger the useEffect above
    Object.assign(currentFiltersRef.current, newFilters);
    // Force a re-fetch by updating state
    setProducts([]);
    setPage(1);
    fetchProducts(1, false);
  }, [fetchProducts]);
  const createProduct = async () => {

  }
  
  const [filterOptions, setFilterOptions] = useState<{
      categories: string[];
      brands: string[];
      tags: string[];
    }>({ categories: [], brands: [], tags: [] });
  const getFilterOptions = async () => {
    var response = await repo.getFilterOptions();
    setFilterOptions(response)
  }
  return {
    products,
    loading,
    error,
    hasMore,
    total,
    page,
    totalPages,
    loadMore,
    refresh,
    updateFilters,
    isFetching,
    getFilterOptions,
    filterOptions
  };
};