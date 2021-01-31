import { FuelType } from "services/backend/nswagts";

export interface TruckRefuelForm {
  fillAmount: number;
  cardNumber: number;
  date: Date;
  fuelType: FuelType;
}
