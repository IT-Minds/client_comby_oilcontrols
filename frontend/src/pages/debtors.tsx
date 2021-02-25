import { Container, Heading, Spinner } from "@chakra-ui/react";
import DebtorTableComp from "components/DebtorTable/DebtorTableComp";
import { useEffectAsync } from "hooks/useEffectAsync";
import { runTimeTable } from "i18n/runtimeTable";
import { GetStaticProps, NextPage } from "next";
import { I18nProps, useI18n } from "next-rosetta";
import { useState } from "react";
import { genDebtorClient } from "services/backend/apiClients";
import { DebtorDto } from "services/backend/nswagts";

const Debtors: NextPage = () => {
  const [debtorEntities, setDebtorEntities] = useState<DebtorDto[]>(null);
  const { t } = useI18n<Locale>();

  useEffectAsync(async () => {
    const data = await genDebtorClient().then(client => client.get());
    setDebtorEntities(data);
  }, []);

  return (
    <Container w="5xl" centerContent>
      <Heading>{t("debtors.debtors")}</Heading>
      {debtorEntities == null ? <Spinner /> : <DebtorTableComp preLoadedData={debtorEntities} />}
    </Container>
  );
};

export const getStaticProps: GetStaticProps<I18nProps<Locale>> = async context => {
  const locale = context.locale || context.defaultLocale;

  let { table = {} } = await import(`../i18n/${locale}`);
  table = runTimeTable(locale, table);
  return { props: { table } };
};

export default Debtors;
