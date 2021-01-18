import { FillingForm } from "./Filling/FillingForm";
export interface CarInfoForm {
  carId: string;
  morning: number;
  evening: number;
  amountFilled: number;
  date: number;
  cardNumber: string;
  fuelType: number;
  headCount: number;
  fillings: FillingForm[];
}
