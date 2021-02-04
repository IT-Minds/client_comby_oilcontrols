import { LocationDebtorType } from "services/backend/nswagts";

export interface LocalDebtorForm {
  debtorType: LocationDebtorType;
  debtorId: number;
}
