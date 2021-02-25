import { createContext } from "react";

type ContextType = {
  refetchData: () => void;
  count: number;
};

export const RefetchDataContext = createContext<ContextType>(null);
