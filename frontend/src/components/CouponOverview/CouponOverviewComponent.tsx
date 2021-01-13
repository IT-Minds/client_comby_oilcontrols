import { Heading, ListItem, Text, UnorderedList, VStack } from "@chakra-ui/react";
import { FC } from "react";
import { CouponInterval } from "types/CouponInterval";

import styles from "./styles.module.css";

type Props = {
  car: string;
  coupons: CouponInterval[];
};

const CouponOverviewComp: FC<Props> = ({ car, coupons }) => {
  return (
    <VStack>
      <Heading>Overview of car: {car}</Heading>
      <Text>Coupons:</Text>
      <UnorderedList>
        <ListItem>AA</ListItem>
        {coupons.map((c, index) => (
          <ListItem key={index}>
            {c.from} - {c.to}
          </ListItem>
        ))}
      </UnorderedList>
    </VStack>
  );
};

export default CouponOverviewComp;
