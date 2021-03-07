import { useCallback, useEffect, useState } from "react";

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

  useEffect(() => {
    const expandingScroll = (): void => {
      const element = document.documentElement;
      const a = element.scrollTop;
      const b = element.scrollHeight - element.clientHeight;
      const c = a / b;

      console.log("Rendered at: " + c);

      if (c > 0.7 && renderIndex < maxItems) {
        setRenderIndex(r => r + renderInterval);
      }

      document.documentElement.offsetHeight;
    };

    if (renderIndex < maxItems) {
      window.addEventListener("scroll", expandingScroll);
    }

    return (): void => {
      window.removeEventListener("scroll", expandingScroll);
    };
  }, [renderIndex, maxItems, renderInterval]);

  const reset = useCallback(() => {
    setRenderIndex(renderInterval);
  }, [renderInterval]);

  return { renderIndex, reset };
};
