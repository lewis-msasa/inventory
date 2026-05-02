import type { JobRequest, CreateUpdateJobResponse, DeleteJobResponse, JobsQueryParams, JobsResponse } from "../../data/jobs/JobDataSource"


export interface JobRepository{
    
      createJob(job: Omit<JobRequest, "id">) : Promise<CreateUpdateJobResponse>
      updateJob(id: string, job: JobRequest) : Promise<CreateUpdateJobResponse>
      deleteJob(id: string) : Promise<DeleteJobResponse>
      getJobs(params: JobsQueryParams) : Promise<JobsResponse>
}