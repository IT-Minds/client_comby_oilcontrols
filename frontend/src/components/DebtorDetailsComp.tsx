import { Container, HStack, Switch, Text, VStack } from "@chakra-ui/react";
import React, { FC, useState } from "react";
import { DebtorDto } from "services/backend/nswagts";

type Props = {
  debtorData: DebtorDto;
};

const DebtorDetailsComp: FC<Props> = ({ debtorData }) => {
  const [debtor, setDebtor] = useState<DebtorDto>(debtorData ?? new DebtorDto({}));

  return (
    <Container w="100%" maxW="unset">
      <VStack>
        <Text>Name: {debtor.name}</Text>
        <Text>Account number: {debtor.accountNumber}</Text>
        <Text>Blocked: {debtor.blocked}</Text>
        <HStack>
          <Text>Coupon is required: {debtor.couponRequired}</Text>
          <Switch
            id="couponRequired"
            //    onChange={e => updateLocalForm(e.target.checked, "isSpecialFill")}
          />
        </HStack>
      </VStack>
    </Container>
  );
};

export default DebtorDetailsComp;
