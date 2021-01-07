import { Dispatch, useCallback, useEffect, useState } from "react";
import { AllListActions, ListReducerActionType } from "react-list-reducer";
import { logger } from "utils/logger";

type Callback<T> = (skip: number, take: number, sortBy: string) => Promise<T>;

interface IPageResult<T> {
  sizeRequested?: number;
  skipRequested?: number;
  sortByRequested?: string | undefined;
  results?: T[] | undefined;
  hasMore?: boolean;
}

export const usePagedFetched = <T extends IPageResult<V>, V = unknown>(
  callback: Callback<T>,
  dataDispatch: Dispatch<AllListActions<V>>,
  initialSkip = 0,
  maxPages = 1000
): {
  done: boolean;
  error: boolean;
  fetchData: (initialSkip: number) => Promise<void>;
} => {
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);

  const fetchData = useCallback(async (initialSkip: number) => {
    try {
      let resultSize = 100;
      let pages = 0;
      const size = 100;

      while (resultSize == size) {
        if (pages > maxPages) throw new Error("Pagination Max Reached!");

        logger.info("Fetching page", pages);
        const pageResult = await callback(pages++ * size + initialSkip, size, "");
        resultSize = pageResult?.results ? pageResult.results.length : -1;

        logger.debug("Page fetched", resultSize);

        if (resultSize > 0)
          dataDispatch({
            type: ListReducerActionType.AddOrUpdate,
            data: pageResult.results
          });
        else setDone(true);
      }
    } catch (err) {
      setError(true);
      logger.warn("usePagedFetched Error", err);
    }
  }, []);

  useEffect(() => {
    fetchData(initialSkip);
  }, [fetchData]);

  return { done, error, fetchData };
};
