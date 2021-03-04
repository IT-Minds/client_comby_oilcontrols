import ComboSelect from "components/SortFilter/ComboSelect";
import { useEffectAsync } from "hooks/useEffectAsync";
import { useI18n } from "next-rosetta";
import { FC, useEffect, useState } from "react";
import { genDebtorClient } from "services/backend/apiClients";
import { IDebtorDto } from "services/backend/nswagts";
import DropdownType from "types/DropdownType";

type Props = {
  cb: (s: IDebtorDto) => void;
  value?: number;
};

const DebtorSelector: FC<Props> = ({ cb, value }) => {
  const { t } = useI18n<Locale>();
  const [debtors, setDebtors] = useState<IDebtorDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [existingDebtor, setExistingDebtor] = useState<DropdownType>({ id: null, name: null });

  useEffectAsync(async () => {
    const client = await genDebtorClient();
    const debtorsData = await client.get();
    setDebtors(debtorsData);
    setIsLoading(false);
  }, [value]);

  useEffect(() => {
    if (value > 0) {
      setExistingDebtor({ id: value.toString(), name: debtors.find(u => u.id === value)?.name });
    } else {
      setExistingDebtor({
        id: "0",
        name: t("debtorSelector.noDebtor") as string
      });
    }
  }, [debtors]);

  return (
    <ComboSelect
      options={[
        {
          id: "0",
          name: t("debtorSelector.noDebtor") as string
        },
        ...debtors.map(s => {
          return {
            id: s.id,
            name: s.name
          };
        })
      ]}
      isLoading={isLoading}
      placeholder={t("debtorSelector.selectDebtor") as string}
      onSelect={x => {
        if (x.id.toString() === "0") {
          cb({
            id: 0,
            name: x.name.toString()
          });
        } else {
          const dto = debtors.find(s => s.id == Number(x.id));
          cb(dto);
        }
      }}
      value={existingDebtor ? existingDebtor : null}
    />
  );
};

export default DebtorSelector;
