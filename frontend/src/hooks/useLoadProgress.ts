import { NextRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { randomNumberBetweenXandY } from "utils/randomNumberBetweenXandY";

export const useLoadProgress = (router: NextRouter): number => {
  const [loadVal, setLoadVal] = useState(0);
  const loadValRef = useRef(null);
  const isLoading = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const incrementLoadVal = useCallback(() => {
    const recursiveIncrement = (curVal: number) => {
      if (isLoading.current && loadValRef.current < 100) {
        const toAdd = randomNumberBetweenXandY(2, curVal < 66 ? 16 : curVal < 80 ? 8 : 4);
        loadValRef.current = curVal + toAdd;
        setLoadVal(curVal + toAdd);
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => recursiveIncrement(curVal + toAdd), 5);
      }
    };
    isLoading.current = true;
    recursiveIncrement(loadValRef.current);
  }, []);

  const finishLoading = useCallback(() => {
    loadValRef.current = 100;
    isLoading.current = false;
    setLoadVal(100);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      loadValRef.current = 0;
      setLoadVal(0);
    }, 1400);
  }, []);

  useEffect(() => {
    const genEvent = (cb: () => void) => (_url: unknown, { shallow = true }) => !shallow && cb();

    router?.events?.on("routeChangeStart", genEvent(incrementLoadVal));
    router?.events?.on("routeChangeComplete", genEvent(finishLoading));
    router?.events?.on("routeChangeError", genEvent(finishLoading));

    return () => {
      clearTimeout(timeoutRef.current);

      router.events.off("routeChangeStart", genEvent(incrementLoadVal));
      router.events.off("routeChangeComplete", genEvent(finishLoading));
      router.events.off("routeChangeError", genEvent(finishLoading));
    };
  }, []);

  return loadVal;
};
