import { Box, Container, useColorModeValue } from "@chakra-ui/react";
import AddCouponComp from "components/CouponManagement/AddCoupon/AddCouponComp";
import { AddCouponForm } from "components/CouponManagement/AddCoupon/AddCouponForm";
import TruckListComp from "components/TruckList/TruckListComp";
import { Locale } from "i18n/Locale";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { I18nProps } from "next-rosetta";
import { useState } from "react";
import { genCouponsClient } from "services/backend/apiClients";
import { PageResultOfCouponDtoAndString, TruckInfoIdDto } from "services/backend/nswagts";

type Props = {
  truckEntities: TruckInfoIdDto[];
  needle: string;
  hasMore: boolean;
  pageCount: number;
};

const TruckInfoPage: NextPage<Props> = ({ truckEntities, needle, hasMore, pageCount }) => {
  const bg = useColorModeValue("gray.100", "gray.700");
  const [addCouponForm, setCouponForm] = useState<AddCouponForm>(null);

  return (
    <Container maxW="xl" centerContent>
      <Box padding="4" bg={bg} maxW="6xl" maxH="4xl" resize="both" overflow="auto">
        <AddCouponComp submitCallback={x => setCouponForm(x)} cars={[]}></AddCouponComp>
      </Box>
    </Container>
  );
};

export const getStaticPaths: GetStaticPaths = async => {
  return {
    paths: [{ params: { id: "" } }],
    fallback: true
  };
};

export const getStaticProps: GetStaticProps<I18nProps<Locale>> = async context => {
  const locale = context.locale || context.defaultLocale;

  const { table = {} } = await import(`../../i18n/${locale}`);
  const data = await genCouponsClient().then(client =>
    //TODO use truckId
    client.get(0).catch(() => {
      return new PageResultOfCouponDtoAndString({
        hasMore: true,
        newNeedle: "0",
        pagesRemaining: 1,
        results: []
      });
    })
  );

  return {
    props: {
      table,
      // !This is a hack to get around undefined values in dataset
      truckEntities: JSON.parse(JSON.stringify(data.results)),
      needle: data.newNeedle ?? "0",
      hasMore: data.hasMore,
      pageCount: data.pagesRemaining + 1
    },
    revalidate: 60
  };
};

export default TruckInfoPage;
