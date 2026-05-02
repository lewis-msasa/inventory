import type { Job, Subtask } from "../../models/job";

export interface JobsResponse {
  jobs: Job[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}
export interface JobsQueryParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  sortBy?: 'created_at' | 'status' | 'completed_at';
  sortOrder?: 'asc' | 'desc';
}

export interface JobRequest {
  id: string;
  batchNumber?: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: Date;
  completedAt?: Date;
  subtasks: Subtask[];
  products: JobProductRequest[]; // Add products to job
  warehouse?: string; // Default warehouse for this job's products
}
export interface JobProductRequest{
    productId: string;
    variantId: string;
}
export interface CreateUpdateJobResponse{
   jobId? : string;
   successful: boolean
}
export interface DeleteJobResponse{
  successful: boolean
}

export interface JobDataSource{
  createJob(job: Omit<JobRequest, "id">) : Promise<CreateUpdateJobResponse>
  updateJob(id: string, job: JobRequest) : Promise<CreateUpdateJobResponse>
  deleteJob(id: string) : Promise<DeleteJobResponse>
  getJobs(params: JobsQueryParams) : Promise<JobsResponse>
}