import { useCallback, useEffect, useState } from "react";

export enum RequestStatus {
    Loading,
    Error,
    Success,
    Failure
}

export const fetchMoreData = (moreDataFn: () => Promise<any>) => {
      
}
export interface PagedData {
    count: number,
    data: any[]
}
export const useGetData = (dataFn: () => Promise<any>) => {
    const [fetchStatus, setFetchStatus] = useState<RequestStatus>(RequestStatus.Success);
    const [data, setData] = useState<PagedData>({count: 0, data: []});
    const fn = useCallback(dataFn,[])
    useEffect(() => {
        async function init() {
          try{
          setFetchStatus(RequestStatus.Loading)
          const data = await fn();
          console.log(data as PagedData)
          setFetchStatus(RequestStatus.Success)         
          setData(data as PagedData);
          }catch(e : any){ 
            console.log(e)
            setFetchStatus(RequestStatus.Error)
          }
        }
        init();
      }, [fn]);
      return {
        fetchStatus,
        setFetchStatus,
        setData,
        data
      }
}