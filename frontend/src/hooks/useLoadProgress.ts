import { NextRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { randomNumberBetweenXandY } from "utils/randomNumberBetweenXandY";

/**
 * This hooks provides a fake load number on every new page load.
 * When the return value is between 0 and 99 (inclusive) the page is loading.
 * At 100 it has completed loading
 * At -1 the page is stable and not loading anymore.
 *
 * When a page load starts the return value starts at 0 and then increments over the next second to 100. As the value edges closer to 100 it slows down.
 * When the page is fully loaded it jumps up to 100 within 5 ms and stays at 100 for 1400ms before going back to -1
 */
export const useLoadProgress = (router: NextRouter): number => {
  const [loadVal, setLoadVal] = useState(-1);
  const loadValRef = useRef(null);
  const isLoading = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const incrementLoadVal = useCallback(() => {
    const recursiveIncrement = (curVal: number) => {
      if (isLoading.current && loadValRef.current < 100) {
        const toAdd = randomNumberBetweenXandY(2, curVal < 50 ? 5 : curVal < 80 ? 3 : 2);
        loadValRef.current = curVal + toAdd;
        setLoadVal(curVal + toAdd);
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => recursiveIncrement(curVal + toAdd), 15);
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
      setLoadVal(-1);
    }, 1400);
  }, []);

  useEffect(() => {
    if (!router) {
      return () => {
        //
      };
    }

    router.events.on("routeChangeStart", genEvent(incrementLoadVal));
    router.events.on("routeChangeComplete", genEvent(finishLoading));
    router.events.on("routeChangeError", genEvent(finishLoading));

    return () => {
      clearTimeout(timeoutRef.current);

      router.events.off("routeChangeStart", genEvent(incrementLoadVal));
      router.events.off("routeChangeComplete", genEvent(finishLoading));
      router.events.off("routeChangeError", genEvent(finishLoading));
    };
  }, [router]);

  return loadVal;
};

const genEvent = (cb: () => void) => (_url: unknown, obj: any) => {
  if (!obj) return;
  const { shallow = true } = obj;

  !shallow && cb();
};
