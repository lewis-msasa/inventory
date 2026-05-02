import { injectable } from "inversify";
import type { CreateUpdateJobResponse, DeleteJobResponse, JobDataSource, JobRequest, JobsQueryParams, JobsResponse } from "../../../domain/data/jobs/JobDataSource";
import type { Job } from "../../../domain/models/job";
import { Search } from "lucide-react";

@injectable()
export class JobDataSourceMock implements JobDataSource{
    private mockJobs: Job[] = [];
    constructor(){
        this.initJobs()
    }
    private initJobs(){
        this.mockJobs = [
        {
            id: '1',
            batchNumber: 'BATCH-001',
            name: 'Summer Collection Intake',
            status: 'in_progress',
            createdAt: new Date('2024-01-15'),
            products: [],
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
            products: [],
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
    }
    async createJob(job: Omit<JobRequest, "id">): Promise<CreateUpdateJobResponse> {
        await new Promise(resolve => setTimeout(resolve, 500));
            const newJob = {
            ...job,
            id: `p${Date.now()}`
            };
            //this.mockJobs.unshift(newJob);
            return {jobId: newJob.id, successful: true};
    }
    async updateJob(id: string, job: JobRequest): Promise<CreateUpdateJobResponse> {
        await new Promise(resolve => setTimeout(resolve, 500));
        const index = this.mockJobs.findIndex(j => j.id === id);
        if (index === -1) throw new Error('Product not found');
        
        //this.mockJobs[index] = { ...this.mockJobs[index], ...job };
        return {jobId: this.mockJobs[index].id, successful: true};

    }
   async deleteJob(id: string): Promise<DeleteJobResponse> {
        await new Promise(resolve => setTimeout(resolve, 500));
        const index = this.mockJobs.findIndex(p => p.id === id);
        if (index !== -1) {
        this.mockJobs.splice(index, 1);
        return { successful: true}
       }
       return {successful: false}
    }
    async getJobs(params: JobsQueryParams): Promise<JobsResponse> {
        await new Promise(resolve => setTimeout(resolve, 800));
        console.log("We are here")
        let filtered = [...this.mockJobs]
         if (params.search) {
        const searchLower = params.search.toLowerCase();
        filtered = filtered.filter(p => 
            p.name?.toLowerCase().includes(searchLower) ||
            //p.status.toLowerCase().includes(searchLower) ||
            p.warehouse?.toLowerCase().includes(searchLower) ||
            p.batchNumber.toLowerCase().includes(searchLower)
        );
        }
        console.log("within " + params)
        if (params.status && params.status !== 'all') {
            console.log(params.status)
            filtered = filtered.filter(p => p.status === params.status);
        }
        if (params.sortBy) {
         filtered.sort((a, b) => {
                let aValue, bValue;

                if (params.sortBy === 'completed_at' && a.completedAt && b.completedAt) { 
                   aValue = a.completedAt?.toISOString();
                   bValue = b.completedAt?.toISOString();
                } else if (params.sortBy === 'created_at') {
                   aValue = a.createdAt.toISOString();
                   bValue = b.createdAt.toISOString();
                } else {
                  aValue = a.name;
                  bValue = b.name;
                }
                
                if (params.sortOrder === 'desc') {
                 return bValue?.localeCompare(aValue);
                }
                return aValue?.localeCompare(bValue);
        });
 
       }
    
     const total = filtered.length;
        const totalPages = Math.ceil(total / params.limit);
        const start = (params.page - 1) * params.limit;
        const end = start + params.limit;
        const jobs = filtered.slice(start, end);

        return {
          jobs,
          total,
          page: params.page,
          totalPages,
          hasMore: params.page < totalPages
    };

  
  }
    
}