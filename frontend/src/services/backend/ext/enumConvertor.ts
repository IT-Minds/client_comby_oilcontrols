import { CouponStatus, FuelType, RefillSchedule, TankState, TankType } from "../nswagts";

type AllEnums =
  | typeof CouponStatus
  | typeof RefillSchedule
  | typeof TankType
  | typeof FuelType
  | typeof TankState;

const enumConvertor = <U extends AllEnums>(enumType: U): Record<keyof U, U[keyof U]> => {
  console.log(enumType.constructor.name);

  const filterAmount = Object.values(enumType).length / 2;
  const filtered = Object.entries(enumType).slice(filterAmount);

  console.log(filterAmount, filtered);
  const result = filtered.reduce<Record<keyof U, U[keyof U]>>((acc, cur) => {
    acc[cur[0] as keyof U] = cur[1];
    return acc;
  }, {} as Record<keyof U, U[keyof U]>);

  return result;
};

export const CouponStatusRecord = enumConvertor(CouponStatus);
export const RefillScheduleRecord = enumConvertor(RefillSchedule);
export const TankTypeRecord = enumConvertor(TankType);
export const FuelTypeRecord = enumConvertor(FuelType);
export const TankStateRecord = enumConvertor(TankState);
