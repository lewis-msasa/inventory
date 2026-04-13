// src/components/Dashboard.tsx
import React from 'react';
import type { InventoryItem, Transaction, Job } from '../../types';

interface DashboardProps {
  inventory: InventoryItem[];
  transactions: Transaction[];
  jobs: Job[];
}

const Dashboard: React.FC<DashboardProps> = ({ inventory, transactions, jobs }) => {
  const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * 50), 0); // Approximate value
  const activeJobs = jobs.filter(job => job.status !== 'completed').length;
  const recentTransactions = [...transactions].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);

  const stats = [
    { name: 'Total Inventory Items', value: totalItems, color: 'bg-blue-500' },
    { name: 'Total Inventory Value', value: `$${totalValue.toFixed(2)}`, color: 'bg-green-500' },
    { name: 'Active Jobs', value: activeJobs, color: 'bg-purple-500' },
    { name: 'Total Transactions', value: transactions.length, color: 'bg-orange-500' },
  ];

  const statusCounts = {
    in_stock: inventory.filter(i => i.status === 'in_stock').reduce((sum, i) => sum + i.quantity, 0),
    reserved: inventory.filter(i => i.status === 'reserved').reduce((sum, i) => sum + i.quantity, 0),
    damaged: inventory.filter(i => i.status === 'damaged').reduce((sum, i) => sum + i.quantity, 0),
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`${stat.color} h-12 w-12 rounded-lg flex items-center justify-center text-white text-xl font-bold`}>
                {stat.name === 'Total Inventory Value' ? '$' : 
                 stat.name === 'Active Jobs' ? '👔' : 
                 stat.name === 'Total Transactions' ? '📊' : '📦'}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Status</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>In Stock</span>
                <span>{statusCounts.in_stock} items</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(statusCounts.in_stock / totalItems) * 100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Reserved</span>
                <span>{statusCounts.reserved} items</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${(statusCounts.reserved / totalItems) * 100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Damaged</span>
                <span>{statusCounts.damaged} items</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(statusCounts.damaged / totalItems) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {recentTransactions.map(transaction => (
              <div key={transaction.id} className="border-b pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Batch: {transaction.batchNumber} | Qty: {transaction.quantity}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">{transaction.date.toLocaleDateString()}</p>
                </div>
                {transaction.notes && <p className="text-xs text-gray-400 mt-1">{transaction.notes}</p>}
              </div>
            ))}
            {recentTransactions.length === 0 && (
              <p className="text-gray-500 text-sm">No recent transactions</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Jobs Summary</h3>
        <div className="space-y-3">
          {jobs.filter(job => job.status !== 'completed').map(job => (
            <div key={job.id} className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">{job.name}</p>
                <p className="text-sm text-gray-500">Batch: {job.batchNumber}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                job.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {job.status}
              </span>
            </div>
          ))}
          {jobs.filter(job => job.status !== 'completed').length === 0 && (
            <p className="text-gray-500">No active jobs</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;