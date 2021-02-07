/* istanbul ignore file */

import { api } from "./api";
import {
  AuthenticationClient,
  CouponsClient,
  DailyTemperatureClient,
  DebtorClient,
  ExampleEntityClient,
  HealthClient,
  LocationClient,
  RefillClient,
  RoleClient,
  StreetClient,
  TruckClient,
  UserClient
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

export const genUserClient = (): Promise<UserClient> => api(UserClient);
export const genAuthenticationClient = (): Promise<AuthenticationClient> =>
  api(AuthenticationClient);
export const genRoleClient = (): Promise<RoleClient> => api(RoleClient);
export const genDebtorClient = (): Promise<DebtorClient> => api(DebtorClient);
