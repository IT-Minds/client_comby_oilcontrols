export interface ReportForm {
  carId: string;
  locationId: string;
  couponId: string;
  fillTypeId: string;
  liters: number;
  isSpecialFill: boolean;
  image: string; //base64 encoded
}
