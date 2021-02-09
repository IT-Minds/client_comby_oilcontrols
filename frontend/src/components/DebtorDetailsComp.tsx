import { Container, HStack, Switch, Text, useToast, VStack } from "@chakra-ui/react";
import React, { FC, useCallback, useState } from "react";
import { genDebtorClient } from "services/backend/apiClients";
import { DebtorDto, IDebtorDto, PrintCouponRequiredCommand } from "services/backend/nswagts";

type Props = {
  debtorData: IDebtorDto;
};

const DebtorDetailsComp: FC<Props> = ({ debtorData }) => {
  const [debtor, setDebtor] = useState<IDebtorDto>(debtorData ?? {});
  const toast = useToast();

  const saveCouponRequired = useCallback(
    async (isRequired: boolean) => {
      const client = await genDebtorClient();
      await client
        .printCouponRequired(
          debtor.dbId,
          new PrintCouponRequiredCommand({
            debtorId: debtor.dbId,
            printCouponRequired: isRequired
          })
        )
        .then(() => {
          setDebtor({ ...debtor, couponRequired: isRequired });
        });
      toast({
        title: "Debtor Updated",
        description: "Successful",
        status: "success",
        duration: 9000,
        isClosable: true
      });
    },
    [debtor]
  );

  return (
    <Container w="100%" maxW="unset">
      <VStack>
        <Text>Name: {debtor.name}</Text>
        <Text>Account number: {debtor.accountNumber}</Text>
        <Text>Blocked: {debtor.blocked ? "true" : "false"}</Text>
        <HStack>
          <Text>Coupon is required: {debtor.couponRequired}</Text>
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
