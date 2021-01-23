import { api } from "./api";
import {
  CouponsClient,
  DailyTemperatureClient,
  ExampleEntityClient,
  HealthClient,
  LocationClient,
  RefillClient,
  StreetClient,
  TruckClient
} from "./nswagts";

export const genExampleClient = (): Promise<ExampleEntityClient> => api(ExampleEntityClient);
export const genHealthClient = (): Promise<HealthClient> => api(HealthClient);
export const genRefillClient = (): Promise<RefillClient> => api(RefillClient);
export const genCouponsClient = (): Promise<CouponsClient> => api(CouponsClient);
export const genStreetClient = (): Promise<StreetClient> => api(StreetClient);
export const genDailyTemperatureClient = (): Promise<DailyTemperatureClient> =>
  api(DailyTemperatureClient);
export const genLocationClient = (): Promise<LocationClient> => api(LocationClient);
export const genTruckClient = (): Promise<TruckClient> => api(TruckClient);
