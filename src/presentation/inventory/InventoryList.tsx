// src/components/InventoryList.tsx
import React, { useState } from 'react';
import type { InventoryItem, Product, Transaction } from '../../types';

interface InventoryListProps {
  inventory: InventoryItem[];
  products: Product[];
  updateInventory: (variantId: string, batchNumber: string, quantity: number, type: 'purchase' | 'damaged' | 'reserve') => void;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  transactions: Transaction[];
}

const InventoryList: React.FC<InventoryListProps> = ({ inventory, products, updateInventory, setTransactions, transactions }) => {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState<'purchase' | 'damaged' | 'reserve'>('purchase');

  const getProductInfo = (variantId: string) => {
    for (const product of products) {
      const variant = product.variants.find(v => v.id === variantId);
      if (variant) {
        return {
          productName: `${product.brand} ${product.model}`,
          variant: variant
        };
      }
    }
    return null;
  };

  const handleInventoryAction = () => {
    if (!selectedItem) return;
    
    const quantity = parseInt(prompt('Enter quantity:') || '0');
    if (quantity <= 0) return;

    const notes = prompt('Notes (optional):') || '';

    const transaction: Transaction = {
      id: Date.now().toString(),
      type: actionType,
      variantId: selectedItem.variantId,
      quantity: quantity,
      batchNumber: selectedItem.batchNumber,
      date: new Date(),
      notes
    };

    setTransactions([...transactions, transaction]);
    updateInventory(selectedItem.variantId, selectedItem.batchNumber, quantity, actionType);
    setShowModal(false);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">Inventory</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warehouse</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inventory.map((item) => {
              const productInfo = getProductInfo(item.variantId);
              if (!productInfo) return null;
              
              return (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{productInfo.productName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      Size: {productInfo.variant.size}<br />
                      Color: {productInfo.variant.color}<br />
                      SKU: {productInfo.variant.sku}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.batchNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.warehouse}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{item.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.status === 'in_stock' ? 'bg-green-100 text-green-800' :
                      item.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setActionType('purchase');
                        setShowModal(true);
                      }}
                      className="text-gray-800 hover:text-indigo-900 mr-3"
                    >
                      Purchase
                    </button>
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setActionType('reserve');
                        setShowModal(true);
                      }}
                      className="text-gray-600 hover:text-yellow-900 mr-3"
                    >
                      Reserve
                    </button>
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setActionType('damaged');
                        setShowModal(true);
                      }}
                      className="text-gray-400 hover:text-red-900"
                    >
                      Write Off
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm {actionType}</h3>
            <p className="mb-4">
              Are you sure you want to mark this item as {actionType}?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleInventoryAction}
                className={`px-4 py-2 rounded-md text-white ${
                  actionType === 'damaged' ? 'bg-red-600 hover:bg-red-700' :
                  actionType === 'reserve' ? 'bg-yellow-600 hover:bg-yellow-700' :
                  'bg-green-600 hover:bg-green-700'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryList;