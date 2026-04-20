// src/components/ProductSelectorModal.tsx
import React, { useState, useEffect} from 'react';
import type { Product } from '../../../domain/models/product';
import { productRepository } from '../../../main';
import { useProductController } from '../../products/hooks/useProductController';
import Modal from '../../common/components/Modal';

interface ProductSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

const ProductSelectorModal: React.FC<ProductSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'brand' | 'model'>('name');

  
  
  //const searchTimeoutRef = useRef<NodeJS.Timeout>(100);
  

  const {
      products,
      loading,
      getFilterOptions,
      filterOptions,
    } = useProductController({
      search: searchTerm,
      category: selectedCategory,
      brand: selectedBrand,
      tag: selectedTag,
      sortBy: sortBy,
      limit: 10,
      enableInfiniteScroll: true
    }, productRepository);
 useEffect(() => {
     getFilterOptions()
  }, []);
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  

  const handleConfirm = () => {
    if (!selectedProduct) {
      alert('Please select a product');
      return;
    }
    
    
    onSelectProduct(selectedProduct);
    resetSelection();
    onClose();
  };

  const resetSelection = () => {
    setSelectedProduct(null);
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedBrand('all');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedBrand('all');
  };

  if (!isOpen) return null;

  return (
    <Modal
     isOpen={isOpen} 
     onClose={ () => {onClose(); clearFilters(); resetSelection();}}
     title="Browse Products"
    >
        
        <div className="flex-1 overflow-hidden flex">
          {/* Left Panel - Product List */}
          <div className="w-full border-r border-gray-200 flex flex-col">
            {/* Search and Filters */}
            <div className="p-4 border-b border-gray-200 space-y-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, brand, or model..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border rounded-md pl-10 pr-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  autoFocus
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <div className="flex space-x-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="flex-1 border rounded-md px-3 py-1 text-sm"
                >
                  <option value="all">All Categories</option>
                  {filterOptions.categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="flex-1 border rounded-md px-3 py-1 text-sm"
                >
                  <option value="all">All Brands</option>
                  {filterOptions.brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
                
                {(searchTerm || selectedCategory !== 'all' || selectedBrand !== 'all') && (
                  <button
                    onClick={clearFilters}
                    className="text-red-600 hover:text-red-800 text-sm px-2"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            
            {/* Products List */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  <p className="mt-2 text-gray-500">Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No products found
                </div>
              ) : (
                <div className="space-y-2">
                  {products.map(product => (
                    <div
                      key={product.id}
                      onClick={() => handleSelectProduct(product)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedProduct?.id === product.id
                          ? 'bg-indigo-50 border-indigo-200 border'
                          : 'hover:bg-gray-50 border border-transparent'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900">
                              {product.name || `${product.brand} ${product.model}`}
                            </h4>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">
                              {product.category}
                            </span>
                          </div>
                          {product.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {product.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="text-xs text-gray-400">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        {selectedProduct?.id === product.id && (
                          <svg className="h-5 w-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {products.length} products found
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                resetSelection();
                onClose();
              }}
              className="px-2 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedProduct}
              className={`px-4 py-2 rounded-md text-white ${
                selectedProduct
                  ? 'bg-indigo-600 hover:bg-indigo-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Select Product
            </button>
          </div>
        </div>
      
    </Modal>
  );
};

export default ProductSelectorModal;