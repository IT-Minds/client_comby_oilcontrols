import { api } from "./api";
import { CouponsClient, ExampleEntityClient, HealthClient, RefillClient } from "./nswagts";

export const genExampleClient = (): Promise<ExampleEntityClient> => api(ExampleEntityClient);
export const genHealthClient = (): Promise<HealthClient> => api(HealthClient);
export const genRefillClient = (): Promise<RefillClient> => api(RefillClient);
export const genCouponsClient = (): Promise<CouponsClient> => api(CouponsClient);
