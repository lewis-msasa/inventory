// src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartBar, faClipboardCheck , faBoxesPacking } from '@fortawesome/free-solid-svg-icons'
import { dummyJobs, dummyProducts, dummyInventory, dummyTransactions } from './data/dummyData';
import Dashboard from './presentation/dashboard/Dashboard';
import InventoryList from './presentation/inventory/InventoryList';
import JobList from './presentation/jobs/components/JobList';
import type { Job, Product, InventoryItem, Transaction } from './types';
import ProductList from './presentation/inventory/ProductList';
import ProductListPage from './presentation/products/pages/ProductListPage';



// Main App Content with routes
const AppContent: React.FC = () => {
  const location = useLocation();
  const [jobs, setJobs] = useState<Job[]>(dummyJobs);
  const [products, setProducts] = useState<Product[]>(dummyProducts);
  const [inventory, setInventory] = useState<InventoryItem[]>(dummyInventory);
  const [transactions, setTransactions] = useState<Transaction[]>(dummyTransactions);

  const updateInventory = (variantId: string, batchNumber: string, quantity: number, type: 'purchase' | 'damaged' | 'reserve') => {
    const inventoryItem = inventory.find(item => item.variantId === variantId && item.batchNumber === batchNumber);
    
    if (inventoryItem) {
      if (type === 'purchase') {
        inventoryItem.quantity -= quantity;
        if (inventoryItem.quantity < 0) inventoryItem.quantity = 0;
      } else if (type === 'damaged') {
        inventoryItem.quantity -= quantity;
        inventoryItem.status = inventoryItem.quantity === 0 ? 'damaged' : 'in_stock';
      } else if (type === 'reserve') {
        inventoryItem.status = 'reserved';
      }
      setInventory([...inventory]);
    }
  };

  const navItems = [
    { path: '/', name: 'Dashboard', icon: faChartBar },
    { path: '/jobs', name: 'Jobs', icon: faClipboardCheck },
    { path: '/inventory', name: 'Inventory', icon: faBoxesPacking },
    { path: '/products', name: 'Products', icon: faBoxesPacking },
    { path: '/invoices', name: 'Invoices', icon: faClipboardCheck },
    
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">My Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">Inventory Management</p>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-gray-100 text-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl"><FontAwesomeIcon icon={item.icon} /></span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
                   
          <div className="text-xs text-gray-400 text-center">
            © 2024 Grip
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto py-6 px-8">
          <Routes>
            <Route path="/" element={<Dashboard inventory={inventory} transactions={transactions} jobs={jobs} />} />
            <Route path="/jobs" element={<JobList jobs={jobs} setJobs={setJobs} />} />
            <Route path="/inventory" element={
              <InventoryList 
                inventory={inventory} 
                products={products} 
                updateInventory={updateInventory} 
                setTransactions={setTransactions} 
                transactions={transactions} 
              />
            } />
            {/* <Route path="/products" element={<ProductList products={products} setProducts={setProducts} />} /> */}
            <Route path="/products" element={<ProductListPage />} />
            {/* <Route path="/products" element={<ProductCatalog products={products} setProducts={setProducts} />} /> */}
            <Route path="/invoices" element={<InvoicesPage />} />
            <Route path="/estimates" element={<EstimatesPage />} />
            <Route path="/price-book" element={<PriceBookPage />} />
            <Route path="/workers" element={<WorkersPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

// Placeholder components for additional pages
const InvoicesPage: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Invoices</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-3xl font-bold text-gray-800">0</p>
          <p className="text-gray-600 mt-2">Unpaid</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-3xl font-bold text-gray-800">$0.00</p>
          <p className="text-gray-600 mt-2">Balance due</p>
        </div>
      </div>
    </div>
  );
};

const EstimatesPage: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Estimates</h2>
      <div className="text-center py-12">
        <p className="text-gray-500">No estimates yet</p>
        <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
          Create First Estimate
        </button>
      </div>
    </div>
  );
};

const PriceBookPage: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Price Book</h2>
      <p className="text-gray-500">Manage your product pricing here</p>
    </div>
  );
};

const WorkersPage: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Workers</h2>
      <div className="text-center py-12">
        <p className="text-gray-500">No workers added yet</p>
        <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
          Add First Worker
        </button>
      </div>
    </div>
  );
};

// Main App component with Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;