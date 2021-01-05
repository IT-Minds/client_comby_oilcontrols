import { HubConnection } from "@microsoft/signalr";
import { createContext } from "react";

type ContextType = {
  connection: HubConnection;
};

export const SignalRContext = createContext<ContextType>(null);
