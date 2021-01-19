import { NextRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { randomNumberBetweenXandY } from "utils/randomNumberBetweenXandY";

export const useLoadProgress = (router: NextRouter): number => {
  const [loadVal, setLoadVal] = useState(0);
  const loadValRef = useRef(null);
  const isLoading = useRef(false);

  const incrementLoadVal = useCallback(() => {
    const recursiveIncrement = (curVal: number) => {
      if (isLoading.current && loadValRef.current < 100) {
        const toAdd = randomNumberBetweenXandY(2, curVal < 66 ? 16 : curVal < 80 ? 8 : 4);
        loadValRef.current = curVal + toAdd;
        setLoadVal(curVal + toAdd);
        setTimeout(() => recursiveIncrement(curVal + toAdd), 5);
      }
    };
    isLoading.current = true;
    recursiveIncrement(loadValRef.current);
  }, []);

  const finishLoading = useCallback(() => {
    loadValRef.current = 100;
    isLoading.current = false;
    setLoadVal(100);
    setTimeout(() => {
      loadValRef.current = 0;
      setLoadVal(0);
    }, 1400);
  }, []);

  useEffect(() => {
    router.events.on("routeChangeStart", (_url, { shallow }) => !shallow && incrementLoadVal());
    router.events.on("routeChangeComplete", (_url, { shallow }) => !shallow && finishLoading());
    router.events.on("routeChangeError", (_url, { shallow }) => !shallow && finishLoading());
  }, []);

  return loadVal;
};
