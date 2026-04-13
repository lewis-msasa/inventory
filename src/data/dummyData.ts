// src/data/dummyData.ts

import type { Job, Product, InventoryItem, Transaction } from "../types";


export const dummyJobs: Job[] = [
  {
    id: '1',
    batchNumber: 'BATCH-001',
    name: 'Summer Collection Intake',
    status: 'in_progress',
    createdAt: new Date('2024-01-15'),
    subtasks: [
      {
        id: '101',
        name: 'Collect from vendors',
        status: 'completed',
        expenses: [
          { id: 'e1', description: 'Transportation', amount: 150, date: new Date('2024-01-16') },
          { id: 'e2', description: 'Labor', amount: 300, date: new Date('2024-01-16') }
        ]
      },
      {
        id: '102',
        name: 'Clean and sort',
        status: 'in_progress',
        expenses: [
          { id: 'e3', description: 'Cleaning supplies', amount: 75, date: new Date('2024-01-17') }
        ]
      },
      {
        id: '103',
        name: 'Determine fitness for inventory',
        status: 'pending',
        expenses: []
      }
    ]
  },
  {
    id: '2',
    batchNumber: 'BATCH-002',
    name: 'Winter Gear Intake',
    status: 'pending',
    createdAt: new Date('2024-01-20'),
    subtasks: [
      {
        id: '201',
        name: 'Collect from vendors',
        status: 'pending',
        expenses: []
      },
      {
        id: '202',
        name: 'Clean and sort',
        status: 'pending',
        expenses: []
      },
      {
        id: '203',
        name: 'Determine fitness for inventory',
        status: 'pending',
        expenses: []
      }
    ]
  }
];

export const dummyProducts: Product[] = [
  {
    id: 'p1',
    category: 'Shoe',
    brand: 'Hoka',
    model: 'Arahi 8',
    tags: ['running shoe', 'terrain', 'stability'],
    variants: [
      {
        id: 'v1',
        size: '8',
        color: 'Black/White',
        sku: 'HOK-AR8-BLK-8',
        costPrice: 80,
        retailPrice: 160,
        barcode: '123456789012',
        inventoryItems: []
      },
      {
        id: 'v2',
        size: '9',
        color: 'Black/White',
        sku: 'HOK-AR8-BLK-9',
        costPrice: 80,
        retailPrice: 160,
        barcode: '123456789013',
        inventoryItems: []
      }
    ]
  },
  {
    id: 'p2',
    category: 'Apparel',
    brand: 'Nike',
    model: 'Dri-FIT Running Shirt',
    tags: ['running', 'summer', 'moisture-wicking'],
    variants: [
      {
        id: 'v3',
        size: 'M',
        color: 'Blue',
        sku: 'NKE-DFS-BLU-M',
        costPrice: 25,
        retailPrice: 50,
        barcode: '123456789014',
        inventoryItems: []
      },
      {
        id: 'v4',
        size: 'L',
        color: 'Blue',
        sku: 'NKE-DFS-BLU-L',
        costPrice: 25,
        retailPrice: 50,
        barcode: '123456789015',
        inventoryItems: []
      }
    ]
  }
];

export const dummyInventory: InventoryItem[] = [
  {
    id: 'inv1',
    variantId: 'v1',
    batchNumber: 'BATCH-001',
    warehouse: 'Main Warehouse',
    quantity: 25,
    status: 'in_stock',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: 'inv2',
    variantId: 'v2',
    batchNumber: 'BATCH-001',
    warehouse: 'Main Warehouse',
    quantity: 30,
    status: 'in_stock',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: 'inv3',
    variantId: 'v3',
    batchNumber: 'BATCH-001',
    warehouse: 'Main Warehouse',
    quantity: 50,
    status: 'reserved',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-19')
  }
];

export const dummyTransactions: Transaction[] = [
  {
    id: 't1',
    type: 'purchase',
    variantId: 'v3',
    quantity: 2,
    batchNumber: 'BATCH-001',
    date: new Date('2024-01-20'),
    customerId: 'CUST001',
    notes: 'Online order'
  },
  {
    id: 't2',
    type: 'reserve',
    variantId: 'v3',
    quantity: 5,
    batchNumber: 'BATCH-001',
    date: new Date('2024-01-19'),
    notes: 'Reserved for retail store'
  }
];