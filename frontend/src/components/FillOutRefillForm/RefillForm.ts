import { FuelType } from "services/backend/nswagts";

export interface RefillForm {
  couponId: string;
  fuelType: FuelType;
  liters: number;
  isSpecialFill: boolean;
  image: string; //base64 encoded
}
