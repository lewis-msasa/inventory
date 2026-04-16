// src/components/JobList.tsx
import React, { useState } from 'react';
import type { Job, Subtask, Expense, JobProduct, Product, ProductVariant } from '../../../types';
import AddProductToJobModal from '../sections/AddProductToJobModal';
import QualityAssessmentModal from '../sections/QualityAssessmentModal';

interface JobListProps {
  jobs: Job[];
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  onAddToInventory: (jobProduct: JobProduct, batchNumber: string, warehouse: string, passedQuantity: number) => Promise<void>;
  onDiscardItems: (jobProduct: JobProduct, batchNumber: string, failedQuantity: number, reason: string) => Promise<void>;

}

const JobList: React.FC<JobListProps> = ({  
  jobs, 
  setJobs, 
  products, 
  setProducts,
  onAddToInventory,
  onDiscardItems
 }) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  // New state for modals
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [showAddSubtaskModal, setShowAddSubtaskModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [currentJobId, setCurrentJobId] = useState<string>('');
  const [currentSubtaskId, setCurrentSubtaskId] = useState<string>('');

  const [showQualityModal, setShowQualityModal] = useState(false);
  const [selectedJobProduct, setSelectedJobProduct] = useState<{jobProduct: JobProduct, jobId: string, productName: string, variantName: string} | null>(null);
  
  // Form states
  const [newJobName, setNewJobName] = useState('');
  const [newSubtaskName, setNewSubtaskName] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [warehouse, setWarehouse] = useState('Main Warehouse');

  const addNewJob = () => {
    if (!newJobName.trim()) return;
    
    const newJob: Job = {
      id: Date.now().toString(),
      batchNumber: `BATCH-${Date.now()}`,
      name: newJobName,
      status: 'pending',
      createdAt: new Date(),
      products: [],
      subtasks: []
    };
    setJobs([...jobs, newJob]);
    setNewJobName('');
    setShowAddJobModal(false);
  };

  const addNewSubtask = () => {
    if (!newSubtaskName.trim()) return;
    
    const newSubtask: Subtask = {
      id: Date.now().toString(),
      name: newSubtaskName,
      status: 'pending',
      expenses: []
    };
    
    setJobs(jobs.map(job => 
      job.id === currentJobId ? {
        ...job,
        subtasks: [...job.subtasks, newSubtask]
      } : job
    ));
    
    setNewSubtaskName('');
    setShowAddSubtaskModal(false);
    setCurrentJobId('');
  };

  const addExpense = () => {
    if (!expenseDescription.trim() || !expenseAmount) return;
    
    const expense: Expense = {
      id: Date.now().toString(),
      description: expenseDescription,
      amount: parseFloat(expenseAmount),
      date: new Date()
    };
    
    setJobs(jobs.map(job => 
      job.id === currentJobId ? {
        ...job,
        subtasks: job.subtasks.map(subtask =>
          subtask.id === currentSubtaskId ? {
            ...subtask,
            expenses: [...subtask.expenses, expense]
          } : subtask
        )
      } : job
    ));
    
    setExpenseDescription('');
    setExpenseAmount('');
    setShowAddExpenseModal(false);
    setCurrentJobId('');
    setCurrentSubtaskId('');
  };

  const updateJobStatus = (jobId: string, status: Job['status']) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, status, completedAt: status === 'completed' ? new Date() : job.completedAt } : job
    ));
  };

  const updateSubtaskStatus = (jobId: string, subtaskId: string, status: Subtask['status']) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? {
        ...job,
        subtasks: job.subtasks.map(subtask =>
          subtask.id === subtaskId ? { ...subtask, status } : subtask
        )
      } : job
    ));
  };

  const getTotalExpenses = (job: Job) => {
    return job.subtasks.reduce((total, subtask) => 
      total + subtask.expenses.reduce((sum, expense) => sum + expense.amount, 0), 0
    );
  };

  const addProductToJob = async (jobProduct: Omit<JobProduct, 'id'>) => {
      const job = jobs.find(j => j.id === currentJobId);
      if (!job) return;
  
      const newJobProduct: JobProduct = {
        id: Date.now().toString(),
        ...jobProduct
      };
  
      // If it's a new product, create it first
      if (jobProduct.newProduct && jobProduct.newVariant) {
        try {
          // Create the product
          //const createdProduct = await productApi.createProduct(jobProduct.newProduct);
          
          // Create the variant
          const newVariant = {
            ...jobProduct.newVariant,
            id: Date.now().toString()
          };
          
          const updatedVariants = [...jobProduct.newProduct.variants, newVariant];
         // await productApi.updateProduct(createdProduct.id, { variants: updatedVariants });
          
          // Update the job product with the new IDs
          newJobProduct.productId = jobProduct.newProduct.name;
          newJobProduct.variantId = newVariant.id;
          delete newJobProduct.newProduct;
          delete newJobProduct.newVariant;
          
          // Refresh products list
          //const updatedProducts = await productApi.getProducts({ page: 1, limit: 100 });
          //setProducts(updatedProducts.products);
          if(newJobProduct.newProduct != null && newJobProduct.newProduct != undefined){
           setProducts([...products, {...newJobProduct.newProduct as Product}])
          }
        } catch (error) {
          console.error('Failed to create product:', error);
          alert('Failed to create product');
          return;
        }
      }
      else{
         // Create the variant
          const newVariant = {
            ...jobProduct.newVariant,
            id: Date.now().toString()
          };
         const product = products.find(p => p.id === newJobProduct.productId);
         // Update the job product with the new IDs
          newJobProduct.productId = product?.id;
          newJobProduct.variantId = newVariant.id;
          delete newJobProduct.newProduct;
          delete newJobProduct.newVariant;
        if(product != null){
         product.variants = [...product.variants, {...newVariant as ProductVariant}]
         console.log(product.variants)
         setProducts([...products, {...product}])
        }
      }
  
      // Update the job with the new product
      setJobs(jobs.map(j => 
        j.id === currentJobId ? {
          ...j,
          products: [...j.products, newJobProduct]
        } : j
      ));
    };

  

      // Function to perform quality assessment
  const performQualityAssessment = async (
    jobProductId: string, 
    passed: number, 
    failed: number, 
    notes: string
  ) => {
    // Find the job and product
    let targetJob: Job | undefined;
    let targetProduct: JobProduct | undefined;
    
    for (const job of jobs) {
      const product = job.products.find(p => p.id === jobProductId);
      if (product) {
        targetJob = job;
        targetProduct = product;
        break;
      }
    }
    
    if (!targetJob || !targetProduct) return;
    
    // Update the job product with quality check results
    setJobs(jobs.map(job => 
      job.id === targetJob!.id ? {
        ...job,
        products: job.products.map(product =>
          product.id === jobProductId ? {
            ...product,
            qualityCheck: {
              passed,
              failed,
              notes,
              checkedAt: new Date(),
              checkedBy: 'Current User' // You can replace with actual user
            },
            status: passed > 0 ? 'in_inventory' : 'damaged'
          } : product
        )
      } : job
    ));
    
    // If the job is completed, automatically add to inventory and discard
    if (targetJob.status === 'completed') {
      if (passed > 0) {
        await onAddToInventory(targetProduct, targetJob.batchNumber, targetJob.warehouse || 'Main Warehouse', passed);
      }
      if (failed > 0) {
        await onDiscardItems(targetProduct, targetJob.batchNumber, failed, notes);
      }
    }
  };

  // Function to complete job and process all products
  const completeJobAndProcessProducts = async (job: Job) => {
    if (job.status !== 'completed') {
      alert('Please mark job as completed first');
      return;
    }

    let hasUnassessed = false;
    
    // Check if all products have been assessed
    for (const product of job.products) {
      if (!product.qualityCheck) {
        hasUnassessed = true;
        break;
      }
    }
    
    if (hasUnassessed) {
      alert('Please perform quality assessment on all products before adding to inventory');
      return;
    }
    
    let totalAdded = 0;
    let totalDiscarded = 0;
    
    // Process each product based on quality assessment
    for (const jobProduct of job.products) {
      if (jobProduct.productId && jobProduct.variantId && jobProduct.qualityCheck) {
        const { passed, failed, notes } = jobProduct.qualityCheck;
        
        if (passed > 0) {
          await onAddToInventory(jobProduct, job.batchNumber, job.warehouse || 'Main Warehouse', passed);
          totalAdded += passed;
        }
        
        if (failed > 0) {
          await onDiscardItems(jobProduct, job.batchNumber, failed, notes || 'Failed quality check');
          totalDiscarded += failed;
        }
      }
    }
    
    alert(`Job processed successfully!\nAdded to inventory: ${totalAdded} items\nDiscarded: ${totalDiscarded} items`);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Jobs</h2>
          <button
            onClick={() => setShowAddJobModal(true)}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Create New Job
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {jobs.map(job => (
          <div key={job.id} className="p-6 hover:bg-gray-50">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{job.name}</h3>
                <p className="text-sm text-gray-500">Batch: {job.batchNumber}</p>
                <p className="text-sm text-gray-500">Warehouse: {job.warehouse || 'Not assigned'}</p>
                <p className="text-sm text-gray-500">Created: {job.createdAt.toLocaleDateString()}</p>

                {/* Products count */}
                <p className="text-sm font-medium text-gray-700 mt-1">
                  Products: {job.products.length != null ? job.products.length : 0} | 
                  Total Quantity: {job.products != null ? job.products.reduce((sum, p) => sum + p.quantity, 0) : 0}
                </p>

                {job.completedAt && (
                  <p className="text-sm text-gray-500">Completed: {job.completedAt.toLocaleDateString()}</p>
                )}
                <p className="text-sm font-medium text-gray-700 mt-1">
                  Total Expenses: ${getTotalExpenses(job).toFixed(2)}
                </p>
              </div>
              <div className="flex space-x-2">
                <select
                  value={job.status}
                  onChange={(e) => updateJobStatus(job.id, e.target.value as Job['status'])}
                  className="border rounded-md px-3 py-1 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <button
                  onClick={() => {
                    setSelectedJob(job);
                    setShowModal(true);
                  }}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  View Details
                </button>
                  {job.status === 'completed' && (
                    <button
                      onClick={() => completeJobAndProcessProducts(job)}
                      className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700"
                    >
                      Process to Inventory
                    </button>
                  )}
              </div>
            </div>

              {/* Products Section with Quality Assessment */}
            {job.products.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-800 mb-2">Products in this Job:</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Product</th>
                        <th className="text-left py-2">Variant</th>
                        <th className="text-left py-2">Quantity</th>
                        <th className="text-left py-2">Quality Check</th>
                        <th className="text-left py-2">Status</th>
                        <th className="text-left py-2">Actions</th>
                       </tr>
                    </thead>
                    <tbody>
                      {job.products.map(jp => {
                        const product = products.find(p => p.id === jp.productId);
                        const variant = product?.variants.find(v => v.id === jp.variantId);
                        console.log(jp)
                        console.log(product)
                        const hasQualityCheck = !!jp.qualityCheck;
                        const passed = jp.qualityCheck?.passed || 0;
                        const failed = jp.qualityCheck?.failed || 0;
                        
                        return (
                          <tr key={jp.id} className="border-b last:border-0">
                            <td className="py-2">
                              {product?.name || `${product?.brand} ${product?.model}` || 'New Product'}
                             </td>
                            <td className="py-2">
                              {variant ? `${variant.size} / ${variant.color}` : 'Variant'}
                             </td>
                            <td className="py-2">{jp.quantity}</td>
                            <td className="py-2">
                              {hasQualityCheck ? (
                                <div>
                                  <span className="text-green-600">✓ {passed}</span>
                                  <span className="mx-1">/</span>
                                  <span className="text-red-600">✗ {failed}</span>
                                  {jp.qualityCheck?.notes && (
                                    <div className="text-xs text-gray-500 mt-1">
                                      Note: {jp.qualityCheck.notes}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-gray-400">Not assessed</span>
                              )}
                             </td>
                            <td className="py-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                jp.status === 'in_inventory' ? 'bg-green-100 text-green-800' :
                                jp.status === 'damaged' ? 'bg-red-100 text-red-800' :
                                jp.status === 'discarded' ? 'bg-gray-100 text-gray-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {jp.status}
                              </span>
                             </td>
                            <td className="py-2">
                              {!hasQualityCheck && (
                                <button
                                  onClick={() => {
                                    setSelectedJobProduct({
                                      jobProduct: jp,
                                      jobId: job.id,
                                      productName: product?.name || `${product?.brand} ${product?.model}` || 'New Product',
                                      variantName: variant ? `${variant.size} / ${variant.color}` : 'Variant'
                                    });
                                    setShowQualityModal(true);
                                  }}
                                  className="text-indigo-600 hover:text-indigo-800 text-sm"
                                >
                                  Assess Quality
                                </button>
                              )}
                              {hasQualityCheck && job.status !== 'completed' && (
                                <button
                                  onClick={() => {
                                    setSelectedJobProduct({
                                      jobProduct: jp,
                                      jobId: job.id,
                                      productName: product?.name || `${product?.brand} ${product?.model}` || 'New Product',
                                      variantName: variant ? `${variant.size} / ${variant.color}` : 'Variant'
                                    });
                                    setShowQualityModal(true);
                                  }}
                                  className="text-indigo-600 hover:text-indigo-800 text-sm"
                                >
                                  Reassess
                                </button>
                              )}
                             </td>
                           </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Add Product Button */}
            <button
              onClick={() => {
                setCurrentJobId(job.id);
                setShowAddProductModal(true);
              }}
              className="mb-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              + Add Product to Job
            </button>
            
            {/* Subtasks Section */}
            <div className="space-y-3">
              {job.subtasks.map(subtask => (
                <div key={subtask.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-800">{subtask.name}</h4>
                    <select
                      value={subtask.status}
                      onChange={(e) => updateSubtaskStatus(job.id, subtask.id, e.target.value as Subtask['status'])}
                      className="border rounded-md px-2 py-1 text-xs"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  
                  {subtask.expenses.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700">Expenses:</p>
                      <ul className="text-sm text-gray-600 mt-1 space-y-1">
                        {subtask.expenses.map(expense => (
                          <li key={expense.id}>
                            {expense.description}: ${expense.amount.toFixed(2)} ({expense.date.toLocaleDateString()})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <button
                    onClick={() => {
                      setCurrentJobId(job.id);
                      setCurrentSubtaskId(subtask.id);
                      setShowAddExpenseModal(true);
                    }}
                    className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm"
                  >
                    + Add Expense
                  </button>
                </div>
              ))}
              
              <button
                onClick={() => {
                  setCurrentJobId(job.id);
                  setShowAddSubtaskModal(true);
                }}
                className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm block"
              >
                + Add Subtask
              </button>
            </div>


          </div>
        ))}
      </div>

       {/* Quality Assessment Modal */}
      {showQualityModal && selectedJobProduct && (
        <QualityAssessmentModal
          isOpen={showQualityModal}
          onClose={() => {
            setShowQualityModal(false);
            setSelectedJobProduct(null);
          }}
          jobProduct={selectedJobProduct.jobProduct}
          productName={selectedJobProduct.productName}
          variantName={selectedJobProduct.variantName}
          onAssess={performQualityAssessment}
        />
      )}

      {/* Add Product Modal */}
      <AddProductToJobModal
        isOpen={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
        onAddProduct={addProductToJob}
        existingProducts={products}
      />

      {/* Add Job Modal */}
      {showAddJobModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Create New Job</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Name
                </label>
                <input
                  type="text"
                  value={newJobName}
                  onChange={(e) => setNewJobName(e.target.value)}
                  className="w-full border rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter job name"
                  autoFocus
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddJobModal(false);
                  setNewJobName('');
                }}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={addNewJob}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Create Job
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Subtask Modal */}
      {showAddSubtaskModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Add New Subtask</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtask Name
                </label>
                <input
                  type="text"
                  value={newSubtaskName}
                  onChange={(e) => setNewSubtaskName(e.target.value)}
                  className="w-full border rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Quality Check, Packaging, etc."
                  autoFocus
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddSubtaskModal(false);
                  setNewSubtaskName('');
                  setCurrentJobId('');
                }}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={addNewSubtask}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Add Subtask
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Add Expense</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={expenseDescription}
                  onChange={(e) => setExpenseDescription(e.target.value)}
                  className="w-full border rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Transportation, Labor, Materials"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount ($)
                </label>
                <input
                  type="number"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  className="w-full border rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddExpenseModal(false);
                  setExpenseDescription('');
                  setExpenseAmount('');
                  setCurrentJobId('');
                  setCurrentSubtaskId('');
                }}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={addExpense}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Add Expense
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Job Details Modal */}
      {showModal && selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Job Details: {selectedJob.name}</h3>
            <div className="space-y-4">
              <div>
                <p><strong>Batch Number:</strong> {selectedJob.batchNumber}</p>
                <p><strong>Status:</strong> {selectedJob.status}</p>
                <p><strong>Created:</strong> {selectedJob.createdAt.toLocaleString()}</p>
                {selectedJob.completedAt && <p><strong>Completed:</strong> {selectedJob.completedAt.toLocaleString()}</p>}
              </div>
              <div>
                <h4 className="font-semibold mb-2">All Expenses Breakdown</h4>
                {selectedJob.subtasks.map(subtask => (
                  <div key={subtask.id} className="ml-4 mb-3">
                    <p className="font-medium">{subtask.name}</p>
                    {subtask.expenses.map(expense => (
                      <p key={expense.id} className="ml-4 text-sm">
                        - {expense.description}: ${expense.amount.toFixed(2)}
                      </p>
                    ))}
                  </div>
                ))}
                <p className="font-bold mt-2">Total: ${getTotalExpenses(selectedJob).toFixed(2)}</p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="mt-6 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobList;