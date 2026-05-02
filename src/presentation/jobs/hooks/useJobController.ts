import { useCallback, useEffect, useRef, useState } from "react";
import type { Job } from "../../../domain/models/job";
import type { JobRepository } from "../../../domain/repositories/jobs/jobRepository";
import { RequestStatus } from "../../common/hooks/common";
import type { JobRequest, JobsQueryParams, JobsResponse } from "../../../domain/data/jobs/JobDataSource";

interface UseJobsOptions {
  initialPage?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: 'created_at' | 'status' | 'completed_at';
  sortOrder?: 'asc' | 'desc';
  enableInfiniteScroll?: boolean;
}

export const useJobController = (options: UseJobsOptions = {}, repo: JobRepository) => {
    const {
        initialPage = 1,
        limit = 10,
        search = '',
        status = 'all',
        sortBy = 'status',
        sortOrder = 'asc',
        enableInfiniteScroll = true
    } = options;

  
    const [jobs, setJobs] = useState<Job[]>([]);
    const [updatedJob, setUpdatedJob] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(1);
    const [isFetching, setIsFetching] = useState(false);
    const [fetchStatus, setFetchStatus] = useState<RequestStatus>();
    const [successful, setSuccess] = useState<boolean>(true);

    const currentFiltersRef = useRef({ search, status, sortBy, sortOrder });
       
      const isInitialMount = useRef(true);
    
      
      // Update refs when filters change
      useEffect(() => {
        currentFiltersRef.current = { search, status, sortBy, sortOrder };
      }, [search, status, sortBy, sortOrder]);


      
        // Update refs when filters change
        useEffect(() => {
          currentFiltersRef.current = { search, status, sortBy, sortOrder };
        }, [search, status, sortBy, sortOrder]);
      
        const fetchJobs = useCallback(async (pageNum: number, append = false) => {
          
          console.log("attempt call with ", search, currentFiltersRef.current.search)
          if (isFetching) return;
          
          setIsFetching(true);
          setLoading(true);
          setError(null);
          console.log("call with ", search, currentFiltersRef.current.search)
          try {
            const params: JobsQueryParams = {
              page: pageNum,
              limit,
              search: search || undefined,
              status: currentFiltersRef.current.status !== 'all' ? currentFiltersRef.current.status : undefined,
              sortBy: currentFiltersRef.current.sortBy,
              sortOrder: currentFiltersRef.current.sortOrder
            };
            const response: JobsResponse = await repo.getJobs(params);
            
            if (append) {
              setJobs(prev => [...prev, ...response.jobs]);
            } else {
              setJobs(response.jobs);
            }
            
            setHasMore(response.hasMore);
            setTotal(response.total);
            setTotalPages(response.totalPages);
            setPage(response.page);
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch products');
            console.error('Error fetching products:', err);
          } finally {
            setLoading(false);
            setIsFetching(false);
          }
        }, [limit, search,status, sortBy, sortOrder, isFetching]);
      
        
      
        // Reset and fetch when filters change
        useEffect(() => {
          if (isInitialMount.current) {
            isInitialMount.current = false;
            fetchJobs(1, false);
            return;
          }
          // Reset pagination when filters change
          setJobs([]);
          setPage(1);
          fetchJobs(1, false);
        }, [search, status, sortBy, sortOrder]);
      
      
        const loadMore = useCallback(() => {
          if (!enableInfiniteScroll) return;
          if (!hasMore || loading || isFetching) return;
          
          const nextPage = page + 1;
          if (nextPage <= totalPages) {
            fetchJobs(nextPage, true);
          }
        }, [hasMore, loading, isFetching, page, totalPages, enableInfiniteScroll, fetchJobs]);
      
        const refresh = useCallback(() => {
          setJobs([]);
          setPage(1);
          fetchJobs(1, false);
        }, [fetchJobs]);
      
        const updateFilters = useCallback((newFilters: Partial<Omit<UseJobsOptions, 'initialPage' | 'limit' | 'enableInfiniteScroll'>>) => {
          // This will trigger the useEffect above
          Object.assign(currentFiltersRef.current, newFilters);
          // Force a re-fetch by updating state
          setJobs([]);
          setPage(1);
          fetchJobs(1, false);
        }, [fetchJobs]);


        const updateJob = async (job: JobRequest) => {
             try{
             setLoading(true)
             const result = await repo.updateJob(job.id, job)
             setLoading(false)
             if(result.successful){
                setUpdatedJob(result.jobId!);
                return {successful: true, jobId: result.jobId!}
             }
             setSuccess(result.successful)
             }
            catch(err : any){
                 
                 console.log(err)
                 setFetchStatus(RequestStatus.Error)
            }
            return {successful: false, jobId: job.id}
            
        
          }


        const [filterOptions, setFilterOptions] = useState<{
            status: string[];
          
            }>({ status: [] });
        const getFilterOptions = async () => {

            var response = {
                status : ["pending", "in_progress", "completed"]
            };
            console.log(response)
            setFilterOptions(response)
        }




        return {
            jobs,
            loading,
            error,
            hasMore,
            total,
            page,
            totalPages,
            loadMore,
            refresh,
            updateFilters,
            isFetching,
            fetchStatus,
            successful,
            getFilterOptions,
            filterOptions,
            updateJob
        };
    


}