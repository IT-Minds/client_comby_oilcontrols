import ComboSelect from "components/SortFilter/ComboSelect";
import { useEffectAsync } from "hooks/useEffectAsync";
import { FC, useState } from "react";
import { genDebtorClient } from "services/backend/apiClients";
import { DebtorDto } from "services/backend/nswagts";

type Props = {
  cb: (s: DebtorDto) => void;
  value?: string;
};

const DebtorSelector: FC<Props> = ({ cb }) => {
  const [debtors, setDebtors] = useState<DebtorDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffectAsync(async () => {
    const client = await genDebtorClient();
    const debtors = await client.get();
    setDebtors(debtors);
    setIsLoading(false);
  }, []);

  // const existingStreet = useMemo(() => {
  //   return debtors.find(s => value.indexOf(s.name) === 0);
  // }, [streets]);

  return (
    <ComboSelect
      options={[
        {
          id: "",
          name: "No Debtor"
        },
        ...debtors.map(s => ({
          ...s,
          id: s.dbId.toString(),
          name: s.name
        }))
      ]}
      isLoading={isLoading}
      placeholder="Select Street"
      onSelect={x => {
        const dto = debtors.find(s => s.dbId == Number(x.id));
        cb(dto);
      }}
    />
  );
};

export default DebtorSelector;
