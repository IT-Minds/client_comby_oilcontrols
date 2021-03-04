import { TruckRefuelForm } from "components/CarInfo/Filling/TruckRefuelForm";
import { RefillForm } from "components/FillOutRefillForm/RefillForm";
import { createContext } from "react";
import { ICouponIdDto, ILocationRefillDto, ITruckInfoDetailsDto } from "services/backend/nswagts";

type ContextType = {
  truck: ITruckInfoDetailsDto;
  coupons: ICouponIdDto[];
  refills: ILocationRefillDto[];

  reloadData: () => void;
  completeTruckRefuel: (form: TruckRefuelForm) => void;
  completeLocationRefill: (reportForm: RefillForm, refillingLocation: ILocationRefillDto) => void;
};

export const TruckContext = createContext<ContextType>({
  truck: null,
  refills: [],
  coupons: [],
  completeLocationRefill: null,
  completeTruckRefuel: null,
  reloadData: null
});
