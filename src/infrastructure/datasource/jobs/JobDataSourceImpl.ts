import { injectable } from "inversify";
import type { CreateUpdateJobResponse, DeleteJobResponse, JobDataSource, JobRequest, JobsQueryParams, JobsResponse } from "../../../domain/data/jobs/JobDataSource";


@injectable()
export class JobDataSourceImpl implements JobDataSource{
    createJob(job: Omit<JobRequest, "id">): Promise<CreateUpdateJobResponse> {
        throw new Error("Method not implemented.");
    }
    updateJob(id: string, job: JobRequest): Promise<CreateUpdateJobResponse> {
        throw new Error("Method not implemented.");
    }
    deleteJob(id: string): Promise<DeleteJobResponse> {
        throw new Error("Method not implemented.");
    }
    getJobs(params: JobsQueryParams): Promise<JobsResponse> {
        throw new Error("Method not implemented.");
    }

}