// src/components/JobList.tsx
import React, { useState } from 'react';
import type { Job, Subtask, Expense } from '../../../types';

interface JobListProps {
  jobs: Job[];
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
}

const JobList: React.FC<JobListProps> = ({ jobs, setJobs }) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  // New state for modals
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [showAddSubtaskModal, setShowAddSubtaskModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [currentJobId, setCurrentJobId] = useState<string>('');
  const [currentSubtaskId, setCurrentSubtaskId] = useState<string>('');
  
  // Form states
  const [newJobName, setNewJobName] = useState('');
  const [newSubtaskName, setNewSubtaskName] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');

  const addNewJob = () => {
    if (!newJobName.trim()) return;
    
    const newJob: Job = {
      id: Date.now().toString(),
      batchNumber: `BATCH-${Date.now()}`,
      name: newJobName,
      status: 'pending',
      createdAt: new Date(),
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

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Jobs</h2>
          <button
            onClick={() => setShowAddJobModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
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
                <p className="text-sm text-gray-500">Created: {job.createdAt.toLocaleDateString()}</p>
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
              </div>
            </div>

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