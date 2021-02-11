import { FuelType } from "services/backend/nswagts";

export interface RefillForm {
  couponNumber: string;
  fuelType: FuelType;
  startliters: number;
  endliters: number;
  isSpecialFill: boolean;
  image: string; //base64 encoded
}
