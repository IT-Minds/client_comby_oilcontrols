import { CouponInterval } from "types/CouponInterval";

export interface AddCouponForm {
  carId: string;
  couponIntervals: CouponInterval[];
}
