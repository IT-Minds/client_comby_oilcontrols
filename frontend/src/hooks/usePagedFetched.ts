import { Dispatch, useCallback, useEffect, useMemo, useState } from "react";
import { AllListActions, ListReducerActionType } from "react-list-reducer";
import { IPageResult } from "services/backend/ext/IPageResult";
import { logger } from "utils/logger";

type Callback<T> = (needle: string, size: number, sortBy: string, skip?: number) => Promise<T>;

type Settings = {
  autoStart?: boolean;
  initialNeedle?: string;
  pageSize?: number;
};
const defaultSettings: Settings = {
  autoStart: true,
  initialNeedle: "0",
  pageSize: 100
};

type Return = {
  done: boolean;
  error: boolean;
  needle: string;
  fetchData: (initialNeedle?: string, initialSkip?: number) => Promise<void>;
};

export const usePagedFetched = <T extends IPageResult<V>, V = unknown>(
  sortBy: string,
  callback: Callback<T>,
  dataDispatch: Dispatch<AllListActions<V>>,
  initSettings: Settings = defaultSettings
): Return => {
  const settings = useMemo(() => Object.assign(defaultSettings, initSettings), []);

  const [done, setDone] = useState(!settings.autoStart);
  const [error, setError] = useState(false);
  const [needle, setNeedle] = useState(settings.initialNeedle);

  const fetchData = useCallback<Return["fetchData"]>(
    async (initialNeedle: string = settings.initialNeedle, initialSkip?: number) => {
      setDone(false);
      setError(false);
      try {
        let resultSize: number;
        let pages = 0;
        let needle = initialNeedle;
        let skip = initialSkip;
        let hasMore = needle !== null || skip !== null;

        while (hasMore) {
          if (pages > Number.parseInt(process.env.NEXT_PUBLIC_MAX_FETCH_PAGES))
            throw new Error("Pagination Max Reached!");

          logger.info("Fetching page", pages++);
          const pageResult = await callback(needle, settings.pageSize, sortBy, skip);
          resultSize = pageResult?.results ? pageResult.results.length : -1;
          needle = pageResult.newNeedle;
          hasMore = pageResult.hasMore;
          skip = 0;

          logger.debug("Page fetched", resultSize);
          if (needle) setNeedle(needle);
          if (resultSize > 0)
            dataDispatch({
              type: ListReducerActionType.AddOrUpdate,
              data: pageResult.results
            });
          if (!hasMore) setDone(true);
        }
      } catch (err) {
        setError(true);
        logger.warn("usePagedFetched Error", err);
      }
    },
    [settings]
  );

  useEffect(() => {
    if (settings.autoStart) fetchData(settings.initialNeedle);
  }, [settings, fetchData]);

  return { done, error, fetchData, needle };
};
