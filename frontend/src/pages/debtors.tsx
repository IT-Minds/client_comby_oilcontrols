import { Container, Heading, Spinner } from "@chakra-ui/react";
import DebtorTableComp from "components/DebtorTable/DebtorTableComp";
import { useEffectAsync } from "hooks/useEffectAsync";
import { GetStaticProps, NextPage } from "next";
import { I18nProps } from "next-rosetta";
import { useState } from "react";
import { genDebtorClient } from "services/backend/apiClients";
import { DebtorDto } from "services/backend/nswagts";

const Debtors: NextPage = () => {
  const [debtorEntities, setDebtorEntities] = useState<DebtorDto[]>(null);

  useEffectAsync(async () => {
    const data = await genDebtorClient().then(client => client.get());
    setDebtorEntities(data);
  }, []);

  return (
    <Container w="5xl" centerContent>
      <Heading>Debtors</Heading>
      {debtorEntities == null ? <Spinner /> : <DebtorTableComp preLoadedData={debtorEntities} />}
    </Container>
  );
};

export const getStaticProps: GetStaticProps<I18nProps<Locale>> = async context => {
  const locale = context.locale || context.defaultLocale;

  const { table = {} } = await import(`../i18n/${locale}`);
  return { props: { table } };
};

export default Debtors;
