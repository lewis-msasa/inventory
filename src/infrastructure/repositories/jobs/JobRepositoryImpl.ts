import { inject, injectable } from "inversify";
import type { JobRepository } from "../../../domain/repositories/jobs/jobRepository";
import type { CreateUpdateJobResponse, DeleteJobResponse, JobDataSource, JobRequest, JobsQueryParams, JobsResponse } from "../../../domain/data/jobs/JobDataSource";
import { TYPES } from "../../../di/types";

@injectable()
export class JobRepositoryImpl implements JobRepository{
    
    private _dataSource : JobDataSource;
    public constructor(
            @inject(TYPES.JobDataSource) dataSource : JobDataSource
        ){
            this._dataSource = dataSource
        }
    createJob(job: Omit<JobRequest, "id">): Promise<CreateUpdateJobResponse> {
        return this._dataSource.createJob(job)
    }
    updateJob(id: string, job: JobRequest): Promise<CreateUpdateJobResponse> {
        return this._dataSource.updateJob(id,job)
    }
    deleteJob(id: string): Promise<DeleteJobResponse> {
        return this._dataSource.deleteJob(id)
    }
    getJobs(params: JobsQueryParams): Promise<JobsResponse> {
        
        return this._dataSource.getJobs(params)
    }
}