import { FuelType, ILocationRefillDto, RefillSchedule, TankType } from "services/backend/nswagts";

export default [
  {
    address: "Somewhereroad 25, 01239 ThisCity",
    expectedDeliveryDate: new Date("2022-04-06"),
    locationId: 1,
    locationType: TankType.BUILDING,
    refillId: 1,
    regionId: 1,
    schedule: RefillSchedule.AUTOMATIC,
    fuelType: FuelType.OIL,
    debtorBlocked: false
  },
  {
    address: "A street 25, 01239 ThisCity",
    expectedDeliveryDate: new Date("2022-02-08"),
    locationId: 1,
    locationType: TankType.SHIP,
    refillId: 2,
    regionId: 1,
    schedule: RefillSchedule.INTERVAL,
    fuelType: FuelType.GASOLINE,
    debtorBlocked: false
  },
  {
    address: "UnderGround Lab 25, 01239 ThisCity",
    expectedDeliveryDate: new Date("2022-06-13"),
    locationId: 1,
    locationType: TankType.TANK,
    refillId: 3,
    regionId: 1,
    schedule: RefillSchedule.MANUAL,
    fuelType: FuelType.PETROLEUM,
    debtorBlocked: true
  }
] as ILocationRefillDto[];
