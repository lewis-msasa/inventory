// src/components/JobList.tsx - Add product handling

import React, { useState } from 'react';
import type { Job, Product, JobProduct, Subtask, Transaction, InventoryItem, DamagedItem } from '../../../types';
import JobList from '../components/JobList';
import { dummyInventory, dummyJobs, dummyProducts } from '../../../data/dummyData';
import { productRepository } from '../../../main';
import { useProductController } from '../../products/hooks/useProductController';

interface JobListPageProps {
  
}

const JobListPage: React.FC<JobListPageProps> = ({ 
}) => {


    const {
        loading,
        successful,
        error,
        createProduct,
        updateProduct
      } = useProductController({}, productRepository);

      const [jobs, setJobs] = useState<Job[]>(dummyJobs);
      const [inventory, setInventory] = useState<InventoryItem[]>(dummyInventory);

      const addToInventoryFromJob = async (
        jobProduct: JobProduct, 
        batchNumber: string, 
        warehouse: string, 
        passedQuantity: number
        ) => {
        if (passedQuantity <= 0) return;
        
        // Check if inventory item already exists
        const existingItem = inventory.find(
            item => item.variantId === jobProduct.variantId && 
            item.batchNumber === batchNumber
        );
        
        if (existingItem) {
            // Update existing inventory item
            existingItem.quantity += passedQuantity;
            existingItem.updatedAt = new Date();
            setInventory([...inventory]);
        } else {
            // Create new inventory item
            const newInventoryItem: InventoryItem = {
            id: Date.now().toString(),
            variantId: jobProduct.variantId!,
            batchNumber: batchNumber,
            warehouse: warehouse,
            quantity: passedQuantity,
            status: 'in_stock',
            createdAt: new Date(),
            updatedAt: new Date()
            };
            setInventory([...inventory, newInventoryItem]);
        }
        
   
        };

        const onDiscardItems = async (
        jobProduct: JobProduct,
        batchNumber: string,
        failedQuantity: number,
        reason: string
        ) => {
        if (failedQuantity <= 0) return;
        
        // Create damaged item record
        const damagedItem: DamagedItem = {
            id: Date.now().toString(),
            jobId: '', // You can track which job it came from
            batchNumber: batchNumber,
            productId: jobProduct.productId!,
            variantId: jobProduct.variantId!,
            quantity: failedQuantity,
            reason: reason,
            notes: `Discarded during quality assessment: ${reason}`,
            createdAt: new Date()
        };
        
        // You can store damaged items in state or send to API
        setDamagedItems([...damagedItems, damagedItem]);
        
        // Update inventory if some were already added
        const inventoryItem = inventory.find(
            item => item.variantId === jobProduct.variantId && 
            item.batchNumber === batchNumber
        );
        
        if (inventoryItem) {
            // If items were already added but now being marked as damaged
            inventoryItem.quantity -= failedQuantity;
            if (inventoryItem.quantity < 0) inventoryItem.quantity = 0;
            setInventory([...inventory]);
        }
        };

        // Add state for damaged items
        const [damagedItems, setDamagedItems] = useState<DamagedItem[]>([]);

  return (
    <JobList 
        jobs={jobs} 
        setJobs={setJobs}
        callResult={{
            loading : loading,
            successful: successful
        }}
        createProduct={createProduct}
        updateProduct={updateProduct}
        onAddToInventory={addToInventoryFromJob}
        onDiscardItems={onDiscardItems}
    />
  )
};

export default JobListPage;