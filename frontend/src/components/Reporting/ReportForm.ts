import { FuelType } from "services/backend/nswagts";

export interface ReportForm {
  carId: string;
  locationId: string;
  couponId: string;
  fuelType: FuelType;
  liters: number;
  isSpecialFill: boolean;
  image: string; //base64 encoded
}
