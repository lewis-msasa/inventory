// src/components/AddProductToJobModal.tsx
import React, { useState, useEffect } from 'react';
import type { JobProduct, Product, ProductVariant } from '../../../types';
import Modal from '../../common/components/Modal';
import { dummyCategories } from '../../../data/dummyData';


interface AddProductToJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (jobProduct: Omit<JobProduct, 'id'>) => void;
  existingProducts: Product[];
}

const AddProductToJobModal: React.FC<AddProductToJobModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
  existingProducts
}) => {
  const [productType, setProductType] = useState<'existing' | 'new'>('existing');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  
  // New product form
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    category: '',
    brand: '',
    model: '',
    tags: '',
    size: '',
    color: '',
    sku: '',
    costPrice: '',
    retailPrice: '',
    barcode: ''
  });

  const [variants, setVariants] = useState<ProductVariant[]>([]);

  // Load variants when product is selected
  useEffect(() => {
    if (selectedProductId) {
      const product = existingProducts.find(p => p.id === selectedProductId);
      setVariants(product?.variants || []);
      setSelectedVariantId('');
    }
  }, [selectedProductId, existingProducts]);

  const handleSubmit = () => {
    if (productType === 'existing') {
      if (!selectedProductId || !selectedVariantId || quantity <= 0) {
        alert('Please select product, variant, and quantity');
        return;
      }
      
      onAddProduct({
        productId: selectedProductId,
        variantId: selectedVariantId,
        quantity,
        status: 'pending',
        notes
      });
    } else {
      // New product
      if (!newProductForm.name || !newProductForm.category || !newProductForm.brand || 
          !newProductForm.model || !newProductForm.size || !newProductForm.color || 
          !newProductForm.sku || quantity <= 0) {
        alert('Please fill in all required fields');
        return;
      }
      
      const tagsArray = newProductForm.tags.split(',').map(t => t.trim()).filter(t => t);
      
      onAddProduct({
        newProduct: {
          name: newProductForm.name,
          category: newProductForm.category,
          brand: newProductForm.brand,
          model: newProductForm.model,
          tags: tagsArray,
          variants: [] // Will add variant separately
        },
        newVariant: {
          size: newProductForm.size,
          color: newProductForm.color,
          sku: newProductForm.sku,
          costPrice: parseFloat(newProductForm.costPrice) || 0,
          retailPrice: parseFloat(newProductForm.retailPrice) || 0,
          barcode: newProductForm.barcode || `BAR-${Date.now()}`,
          inventoryItems: []
        },
        quantity,
        status: 'pending',
        notes
      });
    }
    
    // Reset form and close
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setProductType('existing');
    setSelectedProductId('');
    setSelectedVariantId('');
    setQuantity(1);
    setNotes('');
    setNewProductForm({
      name: '',
      category: '',
      brand: '',
      model: '',
      tags: '',
      size: '',
      color: '',
      sku: '',
      costPrice: '',
      retailPrice: '',
      barcode: ''
    });
  };

  if (!isOpen) return null;

  return (
    

        <Modal 
            isOpen={isOpen} 
            onClose={ () => {onClose(); setProductType('existing')}}
            title="Add Product to Job"
        >
        <div className="p-6">
          {/* Product Type Toggle */}
          <div className="mb-6">
            <div className="flex space-x-4 border-b border-gray-200">
              <button
                onClick={() => setProductType('existing')}
                className={`pb-2 px-4 ${
                  productType === 'existing'
                    ? 'text-indigo-600 border-b-2 border-indigo-600 font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Existing Product
              </button>
              <button
                onClick={() => setProductType('new')}
                className={`pb-2 px-4 ${
                  productType === 'new'
                    ? 'text-indigo-600 border-b-2 border-indigo-600 font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                New Product
              </button>
            </div>
          </div>

          {productType === 'existing' ? (
            // Existing Product Form
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Product <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full border rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Choose a product...</option>
                  {existingProducts.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name || `${product.brand} ${product.model}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* {selectedProductId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Variant <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedVariantId}
                    onChange={(e) => setSelectedVariantId(e.target.value)}
                    className="w-full border rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Choose a variant...</option>
                    {variants.map(variant => (
                      <option key={variant.id} value={variant.id}>
                        {variant.size} / {variant.color} - SKU: {variant.sku}
                      </option>
                    ))}
                  </select>
                </div>
              )} */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full border rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows={3}
                  placeholder="Any special notes about this product..."
                />
              </div>
            </div>
          ) : (
            // New Product Form
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newProductForm.name}
                    onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                    className="w-full border rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., Air Max Running Shoe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                    className="w-full border rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select Category</option>
                    { dummyCategories.map(category => (
                          <option key={category.id} value={category.value}>{category.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newProductForm.brand}
                    onChange={(e) => setNewProductForm({ ...newProductForm, brand: e.target.value })}
                    className="w-full border rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., Nike, Adidas"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Model <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newProductForm.model}
                    onChange={(e) => setNewProductForm({ ...newProductForm, model: e.target.value })}
                    className="w-full border rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., Air Max 2024"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newProductForm.tags}
                    onChange={(e) => setNewProductForm({ ...newProductForm, tags: e.target.value })}
                    className="w-full border rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="running, summer, waterproof"
                  />
                </div>

                {/* <div className="border-t pt-4 col-span-2">
                  <h4 className="font-medium text-gray-800 mb-3">Variant Details</h4>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Size <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newProductForm.size}
                    onChange={(e) => setNewProductForm({ ...newProductForm, size: e.target.value })}
                    className="w-full border rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="S, M, L, 8, 9, 10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newProductForm.color}
                    onChange={(e) => setNewProductForm({ ...newProductForm, color: e.target.value })}
                    className="w-full border rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Black, White, Red"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKU <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newProductForm.sku}
                    onChange={(e) => setNewProductForm({ ...newProductForm, sku: e.target.value })}
                    className="w-full border rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Unique SKU"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Barcode
                  </label>
                  <input
                    type="text"
                    value={newProductForm.barcode}
                    onChange={(e) => setNewProductForm({ ...newProductForm, barcode: e.target.value })}
                    className="w-full border rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Optional"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cost Price ($)
                  </label>
                  <input
                    type="number"
                    value={newProductForm.costPrice}
                    onChange={(e) => setNewProductForm({ ...newProductForm, costPrice: e.target.value })}
                    className="w-full border rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Retail Price ($)
                  </label>
                  <input
                    type="number"
                    value={newProductForm.retailPrice}
                    onChange={(e) => setNewProductForm({ ...newProductForm, retailPrice: e.target.value })}
                    className="w-full border rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full border rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    min="1"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full border rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    rows={3}
                    placeholder="Any special notes about this product..."
                  />
                </div> */}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Add to Job
            </button>
          </div>
        </div>
      </Modal>
        
  );
};

export default AddProductToJobModal;