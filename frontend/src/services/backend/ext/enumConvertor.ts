import {
  Action,
  CouponStatus,
  FuelType,
  LocationDebtorType,
  RefillSchedule,
  TankState,
  TankType
} from "../nswagts";

type AllEnums =
  | typeof CouponStatus
  | typeof RefillSchedule
  | typeof TankType
  | typeof FuelType
  | typeof TankState
  | typeof LocationDebtorType
  | typeof Action;

const enumConvertor = <U extends AllEnums>(enumType: U): Record<keyof U, U[keyof U]> => {
  const filterAmount = Object.values(enumType).length / 2;
  const filtered = Object.entries(enumType).slice(filterAmount);

  const result = filtered.reduce<Record<keyof U, U[keyof U]>>((acc, cur) => {
    acc[cur[0] as keyof U] = cur[1];
    return acc;
  }, {} as Record<keyof U, U[keyof U]>);

  console.log(result);

  return result;
};

export const CouponStatusRecord = enumConvertor(CouponStatus);
export const RefillScheduleRecord = enumConvertor(RefillSchedule);
export const TankTypeRecord = enumConvertor(TankType);
export const FuelTypeRecord = enumConvertor(FuelType);
export const TankStateRecord = enumConvertor(TankState);
export const LocationDebtorTypeRecord = enumConvertor(LocationDebtorType);
export const ActionRecord = enumConvertor(Action);
