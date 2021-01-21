import { Table, TableCaption, Tbody, Th, Thead, Tr } from "@chakra-ui/react";
import { FC } from "react";
import { CouponInterval } from "types/CouponInterval";

type Props = {
  car: string;
  coupons: CouponInterval[];
};

const CouponOverviewComp: FC<Props> = ({ car, coupons }) => {
  return (
    <Table variant="striped" colorScheme="teal">
      <TableCaption placement="top">Coupon overview of car {car}</TableCaption>
      <Thead>
        <Tr>
          <Th>Coupons</Th>
        </Tr>
      </Thead>
      <Tbody>
        {coupons.map((c, index) => (
          <tr key={index}>
            <td>
              {c.start} - {c.end}
            </td>
          </tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default CouponOverviewComp;
