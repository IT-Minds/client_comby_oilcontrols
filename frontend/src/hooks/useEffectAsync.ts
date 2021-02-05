import { DependencyList, EffectCallback, useEffect } from "react";

export const useEffectAsync = (
  cb: () => Promise<ReturnType<EffectCallback>>,
  deps: DependencyList
): void => {
  useEffect(() => {
    cb();
  }, [...deps]);
};
