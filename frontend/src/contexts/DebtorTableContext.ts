import { createContext } from "react";
import { IDebtorDto } from "services/backend/nswagts";

type ContextType = {
  debtorUpdated: (debtor: IDebtorDto) => void;
};

export const DebtorTableContext = createContext<ContextType>(null);
