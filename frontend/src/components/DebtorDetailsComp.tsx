import { Container, HStack, Switch, Text, useToast, VStack } from "@chakra-ui/react";
import { DebtorTableContext } from "contexts/DebtorTableContext";
import { useI18n } from "next-rosetta";
import React, { FC, useCallback, useContext, useState } from "react";
import { genDebtorClient } from "services/backend/apiClients";
import { IDebtorDto, PrintCouponRequiredCommand } from "services/backend/nswagts";

type Props = {
  debtorData: IDebtorDto;
};

const DebtorDetailsComp: FC<Props> = ({ debtorData }) => {
  const { t } = useI18n<Locale>();

  const [debtor, setDebtor] = useState<IDebtorDto>(debtorData ?? {});
  const toast = useToast();
  const { debtorUpdated } = useContext(DebtorTableContext);

  const saveCouponRequired = useCallback(
    async (isRequired: boolean) => {
      const client = await genDebtorClient();
      await client.printCouponRequired(
        debtor.dbId,
        new PrintCouponRequiredCommand({
          debtorId: debtor.dbId,
          printCouponRequired: isRequired
        })
      );
      setDebtor({ ...debtor, couponRequired: isRequired });
      debtorUpdated({ ...debtor, couponRequired: isRequired });
      toast({
        title: t("toast.updateDebtor"),
        description: t("toast.successful"),
        status: "success",
        duration: 9000,
        isClosable: true
      });
    },
    [debtor]
  );

  return (
    <Container w="100%" maxW="unset" textAlign="center">
      <VStack textAlign="left" display="inline-block">
        <HStack>
          <Text fontWeight="bold">{t("debtorTable.debtorDetails.name")}</Text>
          <Text>{debtor.name}</Text>
        </HStack>

        <HStack>
          <Text fontWeight="bold">{t("debtorTable.debtorDetails.accountNumber")}</Text>
          <Text>{debtor.accountNumber}</Text>
        </HStack>

        <HStack>
          <Text fontWeight="bold">{t("debtorTable.debtorDetails.blocked")}</Text>
          <Text>
            {debtor.blocked
              ? t("debtorTable.debtorDetails.yes")
              : t("debtorTable.debtorDetails.no")}
          </Text>
        </HStack>

        <HStack>
          <Text fontWeight="bold">
            {t("debtorTable.debtorDetails.couponIsRequired")} {debtor.couponRequired}
          </Text>
          <Switch
            isChecked={debtor.couponRequired}
            id="couponRequired"
            onChange={e => saveCouponRequired(e.target.checked)}
          />
        </HStack>
      </VStack>
    </Container>
  );
};

export default DebtorDetailsComp;
