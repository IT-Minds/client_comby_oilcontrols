import { createContext, MutableRefObject } from "react";

type ContextType = {
  ref: MutableRefObject<HTMLDivElement>;
};

export const ContainerRefContext = createContext<ContextType>(null);
