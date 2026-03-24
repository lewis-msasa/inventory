import React from "react";

const InvoicesCard: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-900">Invoices</h2>
        <button className="border border-gray-300 hover:bg-gray-50 text-gray-800 text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          Create invoice
        </button>
      </div>

      <div className="flex gap-8">
        <div>
          <p className="text-2xl font-bold text-gray-900">0</p>
          <p className="text-sm text-gray-400 mt-0.5">Unpaid</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">$0.00</p>
          <p className="text-sm text-gray-400 mt-0.5">Balance due</p>
        </div>
      </div>
    </div>
  );
};

export default InvoicesCard;