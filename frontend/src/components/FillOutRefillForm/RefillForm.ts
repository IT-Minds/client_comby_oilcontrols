import { FuelType } from "services/backend/nswagts";

export interface RefillForm {
  couponId: string;
  fuelType: FuelType;
  startliters: number;
  endliters: number;
  isSpecialFill: boolean;
  image: string; //base64 encoded
}
