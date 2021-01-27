import { useEffect } from "react";

export const useEffectAsync = (cb: () => Promise<void>, deps: unknown[]): void => {
  useEffect(() => {
    cb();
  }, [...deps]);
};
