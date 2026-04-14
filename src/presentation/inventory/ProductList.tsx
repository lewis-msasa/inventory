// src/components/ProductList.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Product, ProductVariant } from '../../types';

interface ProductListProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const ProductList: React.FC<ProductListProps> = ({ products, setProducts }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'brand' | 'model'>('name');
  
  // Pagination/Infinite scroll states
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastProductRef = useRef<HTMLDivElement | null>(null);
  
  const ITEMS_PER_PAGE = 10;

  // Get unique categories, brands, and tags for filters
  const categories = ['all', ...new Set(products.map(p => p.category))];
  const brands = ['all', ...new Set(products.map(p => p.brand))];
  const tags = ['all', ...new Set(products.flatMap(p => p.tags))];

  // Filter and sort products
  const getFilteredAndSortedProducts = useCallback(() => {
    let filtered = [...products];
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    // Brand filter
    if (selectedBrand !== 'all') {
      filtered = filtered.filter(p => p.brand === selectedBrand);
    }
    
    // Tag filter
    if (selectedTag !== 'all') {
      filtered = filtered.filter(p => p.tags.includes(selectedTag));
    }
    
    // Sorting
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return (a.name || `${a.brand} ${a.model}`).localeCompare(b.name || `${b.brand} ${b.model}`);
      } else if (sortBy === 'brand') {
        return a.brand.localeCompare(b.brand);
      } else {
        return a.model.localeCompare(b.model);
      }
    });
    
    return filtered;
  }, [products, searchTerm, selectedCategory, selectedBrand, selectedTag, sortBy]);

  // Load more products for infinite scroll
  const loadMoreProducts = useCallback(() => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    const filtered = getFilteredAndSortedProducts();
    const startIndex = 0;
    const endIndex = page * ITEMS_PER_PAGE;
    const newProducts = filtered.slice(startIndex, endIndex);
    
    setTimeout(() => {
      setDisplayedProducts(newProducts);
      setHasMore(endIndex < filtered.length);
      setLoading(false);
    }, 500); // Simulate loading delay
  }, [getFilteredAndSortedProducts, page, loading, hasMore]);

  // Reset pagination when filters change
  useEffect(() => {
    setPage(1);
    setDisplayedProducts([]);
    setHasMore(true);
  }, [searchTerm, selectedCategory, selectedBrand, selectedTag, sortBy]);

  // Load products when page changes
  useEffect(() => {
    loadMoreProducts();
  }, [page, loadMoreProducts]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (lastProductRef.current) {
      observerRef.current.observe(lastProductRef.current);
    }
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [displayedProducts, hasMore, loading]);

  const addNewProduct = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: 'New Product',
      category: 'Shoe',
      brand: 'New Brand',
      model: 'New Model',
      tags: [],
      variants: []
    };
    setProducts([...products, newProduct]);
    setEditingProduct(newProduct);
    setShowModal(true);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    setShowModal(false);
    setEditingProduct(null);
  };

  const addVariant = (productId: string) => {
    const newVariant: ProductVariant = {
      id: Date.now().toString(),
      size: 'M',
      color: 'Black',
      sku: `SKU-${Date.now()}`,
      costPrice: 50,
      retailPrice: 100,
      barcode: `BAR-${Date.now()}`,
      inventoryItems: []
    };
    
    setProducts(products.map(product => 
      product.id === productId ? {
        ...product,
        variants: [...product.variants, newVariant]
      } : product
    ));
  };

  const updateVariant = (productId: string, variantId: string, updates: Partial<ProductVariant>) => {
    setProducts(products.map(product =>
      product.id === productId ? {
        ...product,
        variants: product.variants.map(variant =>
          variant.id === variantId ? { ...variant, ...updates } : variant
        )
      } : product
    ));
  };

  const deleteVariant = (productId: string, variantId: string) => {
    setProducts(products.map(product =>
      product.id === productId ? {
        ...product,
        variants: product.variants.filter(v => v.id !== variantId)
      } : product
    ));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSelectedTag('all');
    setSortBy('name');
  };

  const getTotalVariants = () => {
    return displayedProducts.reduce((total, product) => total + product.variants.length, 0);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Products</h2>
            <p className="text-sm text-gray-500 mt-1">
              {getFilteredAndSortedProducts().length} total products | {getTotalVariants()} variants
            </p>
          </div>
          <button
            onClick={addNewProduct}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            + Add Product
          </button>
        </div>

        {/* Search and Filters Bar */}
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search products by name, brand, or model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border rounded-md pl-10 pr-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border rounded-md px-3 py-1 text-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Brand:</span>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="border rounded-md px-3 py-1 text-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                {brands.map(brand => (
                  <option key={brand} value={brand}>
                    {brand === 'all' ? 'All Brands' : brand}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Tag:</span>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="border rounded-md px-3 py-1 text-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                {tags.map(tag => (
                  <option key={tag} value={tag}>
                    {tag === 'all' ? 'All Tags' : tag}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border rounded-md px-3 py-1 text-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="name">Name</option>
                <option value="brand">Brand</option>
                <option value="model">Model</option>
              </select>
            </div>

            {(searchTerm || selectedCategory !== 'all' || selectedBrand !== 'all' || selectedTag !== 'all') && (
              <button
                onClick={clearFilters}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Active Filters Display */}
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                Search: {searchTerm}
                <button onClick={() => setSearchTerm('')} className="ml-1 hover:text-blue-600">×</button>
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory('all')} className="ml-1 hover:text-green-600">×</button>
              </span>
            )}
            {selectedBrand !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                Brand: {selectedBrand}
                <button onClick={() => setSelectedBrand('all')} className="ml-1 hover:text-purple-600">×</button>
              </span>
            )}
            {selectedTag !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                Tag: {selectedTag}
                <button onClick={() => setSelectedTag('all')} className="ml-1 hover:text-yellow-600">×</button>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Products List with Infinite Scroll */}
      <div className="divide-y divide-gray-200">
        {displayedProducts.map((product, index) => (
          <div
            key={product.id}
            ref={index === displayedProducts.length - 1 ? lastProductRef : null}
            className="p-6 hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {product.name || `${product.brand} ${product.model}`}
                  </h3>
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-700">
                    {product.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {product.brand} - {product.model}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {product.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => {
                  setEditingProduct(product);
                  setShowModal(true);
                }}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                Edit Product
              </button>
            </div>

            {/* Variants Table */}
            <div className="mt-4">
              <h4 className="font-medium text-gray-800 mb-2">
                Variants ({product.variants.length})
              </h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Color</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Retail</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Barcode</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {product.variants.map(variant => (
                      <tr key={variant.id}>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={variant.size}
                            onChange={(e) => updateVariant(product.id, variant.id, { size: e.target.value })}
                            className="border rounded px-1 py-0.5 w-16 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={variant.color}
                            onChange={(e) => updateVariant(product.id, variant.id, { color: e.target.value })}
                            className="border rounded px-1 py-0.5 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={variant.sku}
                            onChange={(e) => updateVariant(product.id, variant.id, { sku: e.target.value })}
                            className="border rounded px-1 py-0.5 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={variant.costPrice}
                            onChange={(e) => updateVariant(product.id, variant.id, { costPrice: parseFloat(e.target.value) })}
                            className="border rounded px-1 py-0.5 w-20 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={variant.retailPrice}
                            onChange={(e) => updateVariant(product.id, variant.id, { retailPrice: parseFloat(e.target.value) })}
                            className="border rounded px-1 py-0.5 w-20 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={variant.barcode}
                            onChange={(e) => updateVariant(product.id, variant.id, { barcode: e.target.value })}
                            className="border rounded px-1 py-0.5 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => deleteVariant(product.id, variant.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                onClick={() => addVariant(product.id)}
                className="mt-3 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                + Add Variant
              </button>
            </div>
          </div>
        ))}
        
        {/* Loading indicator */}
        {loading && (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-gray-500">Loading more products...</p>
          </div>
        )}
        
        {/* No more products message */}
        {!hasMore && displayedProducts.length > 0 && (
          <div className="p-8 text-center text-gray-500">
            No more products to load
          </div>
        )}
        
        {/* Empty state */}
        {!loading && displayedProducts.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-gray-500 mb-4">No products found matching your criteria</p>
            <button
              onClick={clearFilters}
              className="text-indigo-600 hover:text-indigo-800"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Edit Product Modal */}
      {showModal && editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Edit Product</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Product Name</label>
                <input
                  type="text"
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="mt-1 block w-full border rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Product name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <input
                  type="text"
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  className="mt-1 block w-full border rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Brand</label>
                <input
                  type="text"
                  value={editingProduct.brand}
                  onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                  className="mt-1 block w-full border rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Model</label>
                <input
                  type="text"
                  value={editingProduct.model}
                  onChange={(e) => setEditingProduct({ ...editingProduct, model: e.target.value })}
                  className="mt-1 block w-full border rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={editingProduct.tags.join(', ')}
                  onChange={(e) => setEditingProduct({ ...editingProduct, tags: e.target.value.split(',').map(t => t.trim()) })}
                  className="mt-1 block w-full border rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => updateProduct(editingProduct)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;