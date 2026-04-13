// src/components/ProductCatalog.tsx
import React, { useState } from 'react';
import type { Product, ProductVariant } from '../../types';

interface ProductCatalogProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({ products, setProducts }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const addNewProduct = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
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

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Product Catalog</h2>
          <button
            onClick={addNewProduct}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Add Product
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {products.map(product => (
          <div key={product.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {product.brand} {product.model}
                </h3>
                <p className="text-sm text-gray-500">Category: {product.category}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {product.tags.map((tag, idx) => (
                    <span key={idx} className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">
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
                className="text-indigo-600 hover:text-indigo-800 text-sm"
              >
                Edit Product
              </button>
            </div>

            <div className="mt-4">
              <h4 className="font-medium text-gray-800 mb-2">Variants</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Size</th>
                      <th className="px-4 py-2 text-left">Color</th>
                      <th className="px-4 py-2 text-left">SKU</th>
                      <th className="px-4 py-2 text-left">Cost Price</th>
                      <th className="px-4 py-2 text-left">Retail Price</th>
                      <th className="px-4 py-2 text-left">Barcode</th>
                      <th className="px-4 py-2 text-left">Actions</th>
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
                            className="border rounded px-1 py-0.5 w-16"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={variant.color}
                            onChange={(e) => updateVariant(product.id, variant.id, { color: e.target.value })}
                            className="border rounded px-1 py-0.5"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={variant.sku}
                            onChange={(e) => updateVariant(product.id, variant.id, { sku: e.target.value })}
                            className="border rounded px-1 py-0.5"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={variant.costPrice}
                            onChange={(e) => updateVariant(product.id, variant.id, { costPrice: parseFloat(e.target.value) })}
                            className="border rounded px-1 py-0.5 w-20"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={variant.retailPrice}
                            onChange={(e) => updateVariant(product.id, variant.id, { retailPrice: parseFloat(e.target.value) })}
                            className="border rounded px-1 py-0.5 w-20"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={variant.barcode}
                            onChange={(e) => updateVariant(product.id, variant.id, { barcode: e.target.value })}
                            className="border rounded px-1 py-0.5"
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
                className="mt-3 text-indigo-600 hover:text-indigo-800 text-sm"
              >
                + Add Variant
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Edit Product</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <input
                  type="text"
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Brand</label>
                <input
                  type="text"
                  value={editingProduct.brand}
                  onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Model</label>
                <input
                  type="text"
                  value={editingProduct.model}
                  onChange={(e) => setEditingProduct({ ...editingProduct, model: e.target.value })}
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={editingProduct.tags.join(', ')}
                  onChange={(e) => setEditingProduct({ ...editingProduct, tags: e.target.value.split(',').map(t => t.trim()) })}
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
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

export default ProductCatalog;