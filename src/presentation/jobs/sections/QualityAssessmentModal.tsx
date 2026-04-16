
import React, { useState } from 'react';
import type { JobProduct } from '../../../types';

interface QualityAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobProduct: JobProduct;
  productName: string;
  variantName: string;
  onAssess: (jobProductId: string, passed: number, failed: number, notes: string) => void;
}

const QualityAssessmentModal: React.FC<QualityAssessmentModalProps> = ({
  isOpen,
  onClose,
  jobProduct,
  productName,
  variantName,
  onAssess
}) => {
  const [passed, setPassed] = useState(jobProduct.qualityCheck?.passed || jobProduct.quantity);
  const [failed, setFailed] = useState(jobProduct.qualityCheck?.failed || 0);
  const [notes, setNotes] = useState(jobProduct.qualityCheck?.notes || '');

  const total = passed + failed;
  const maxQuantity = jobProduct.quantity;

  const handlePassedChange = (value: number) => {
    const newPassed = Math.min(maxQuantity, Math.max(0, value));
    setPassed(newPassed);
    setFailed(maxQuantity - newPassed);
  };

  const handleFailedChange = (value: number) => {
    const newFailed = Math.min(maxQuantity, Math.max(0, value));
    setFailed(newFailed);
    setPassed(maxQuantity - newFailed);
  };

  const handleSubmit = () => {
    if (passed + failed !== maxQuantity) {
      alert(`Total must equal ${maxQuantity}`);
      return;
    }
    onAssess(jobProduct.id, passed, failed, notes);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">Quality Assessment</h3>
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <p className="text-sm text-gray-600">Product:</p>
            <p className="font-medium text-gray-900">{productName}</p>
            <p className="text-sm text-gray-500">{variantName}</p>
            <p className="text-sm text-gray-500 mt-1">Total Quantity: {jobProduct.quantity}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Passed Quality Check (Go to Inventory)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max={jobProduct.quantity}
                  value={passed}
                  onChange={(e) => handlePassedChange(parseInt(e.target.value))}
                  className="flex-1"
                />
                <input
                  type="number"
                  value={passed}
                  onChange={(e) => handlePassedChange(parseInt(e.target.value) || 0)}
                  className="w-20 border rounded-md p-1 text-center"
                  min="0"
                  max={jobProduct.quantity}
                />
              </div>
              <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all"
                  style={{ width: `${(passed / jobProduct.quantity) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Failed Quality Check (To be Discarded)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max={jobProduct.quantity}
                  value={failed}
                  onChange={(e) => handleFailedChange(parseInt(e.target.value))}
                  className="flex-1"
                />
                <input
                  type="number"
                  value={failed}
                  onChange={(e) => handleFailedChange(parseInt(e.target.value) || 0)}
                  className="w-20 border rounded-md p-1 text-center"
                  min="0"
                  max={jobProduct.quantity}
                />
              </div>
              <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500 transition-all"
                  style={{ width: `${(failed / jobProduct.quantity) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quality Notes (Reasons for failure)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows={4}
                placeholder="e.g., Scratches, damaged packaging, wrong color, size issues, etc."
              />
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm font-medium text-gray-700">Summary:</p>
              <div className="mt-2 space-y-1 text-sm">
                <p className="flex justify-between">
                  <span>Total Items:</span>
                  <span className="font-medium">{jobProduct.quantity}</span>
                </p>
                <p className="flex justify-between text-green-600">
                  <span>✓ Passed (to Inventory):</span>
                  <span className="font-medium">{passed}</span>
                </p>
                <p className="flex justify-between text-red-600">
                  <span>✗ Failed (to Discard):</span>
                  <span className="font-medium">{failed}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Save Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualityAssessmentModal;