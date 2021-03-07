import { ContainerRefContext } from "contexts/ContainerRefContext";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

type Props = {
  renderInterval?: number;
  maxItems?: number;
};

type Return = {
  renderIndex: number;
  reset(): void;
};

type Hook = (props?: Props) => Return;

export const useLazyScrollLoad: Hook = ({ renderInterval = 30, maxItems = 100 }) => {
  const [renderIndex, setRenderIndex] = useState(renderInterval);
  const { ref } = useContext(ContainerRefContext);
  const element = ref.current;

  const timerRef = useRef<NodeJS.Timeout>(null);
  const stopRef = useRef(false);

  const expandingScroll = useCallback((): void => {
    if (!stopRef.current) {
      stopRef.current = true;

      const a = element.scrollTop;
      const b = element.scrollHeight - element.clientHeight;
      const c = b === 0 ? 0 : a / b;

      if (c > 0.8 && renderIndex < maxItems) {
        console.log("locking");
        setRenderIndex(r => r + renderInterval);
      }

      timerRef.current = setTimeout(() => {
        console.log("unlocking");
        stopRef.current = false;
      }, 100);
    } else {
      console.log("locked");
    }
  }, [renderIndex, maxItems, renderInterval]);

  useEffect(() => {
    if (element) {
      element.onscroll = expandingScroll;
    }
  }, [expandingScroll]);

  useEffect(() => {
    if (element) {
      expandingScroll();
    }
  }, [maxItems, renderInterval]);

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  const reset = useCallback(() => {
    setRenderIndex(renderInterval);
  }, [renderInterval]);

  return { renderIndex, reset };
};
