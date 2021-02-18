import ComboSelect from "components/SortFilter/ComboSelect";
import { useEffectAsync } from "hooks/useEffectAsync";
import { useI18n } from "next-rosetta";
import { FC, useState } from "react";
import { genDebtorClient } from "services/backend/apiClients";
import { DebtorDto } from "services/backend/nswagts";

type Props = {
  cb: (s: DebtorDto) => void;
  value?: string;
};

const DebtorSelector: FC<Props> = ({ cb }) => {
  const { t } = useI18n<Locale>();
  const [debtors, setDebtors] = useState<DebtorDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffectAsync(async () => {
    const client = await genDebtorClient();
    const debtors = await client.get();
    setDebtors(debtors);
    setIsLoading(false);
  }, []);

  return (
    <ComboSelect
      options={[
        {
          id: "",
          name: t("debtorSelector.noDebtor") as string
        },
        ...debtors.map(s => ({
          ...s,
          id: s.dbId.toString(),
          name: s.name
        }))
      ]}
      isLoading={isLoading}
      placeholder={t("debtorSelector.selectDebtor") as string}
      onSelect={x => {
        const dto = debtors.find(s => s.dbId == Number.parseInt(x.id));
        cb(dto);
      }}
    />
  );
};

export default DebtorSelector;
