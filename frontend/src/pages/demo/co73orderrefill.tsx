import { Box, Container, useColorModeValue, useToast } from "@chakra-ui/react";
import OrederRefillComp from "components/OrderRefill/OrderRefillComp";
import { Locale } from "i18n/Locale";
import { GetStaticProps, NextPage } from "next";
import { I18nProps } from "next-rosetta";
import { useCallback } from "react";
import { genRefillClient } from "services/backend/apiClients";
import { IOrderRefillCommand, OrderRefillCommand } from "services/backend/nswagts";

const DemoPage: NextPage = () => {
  const toast = useToast();
  const bg = useColorModeValue("gray.100", "gray.700");

  const postOrderRefill = useCallback(async (orderRefill: IOrderRefillCommand) => {
    const client = await genRefillClient();
    await client.orderRefill(
      new OrderRefillCommand({
        expectedDeliveryDate: orderRefill.expectedDeliveryDate,
        locationId: orderRefill.locationId
      })
    );

    toast({
      title: "Refill Ordered",
      description: "Successful",
      status: "success",
      duration: 9000,
      isClosable: true
    });

    Date.now().toString();
  }, []);

  return (
    <Container maxW="xl" centerContent>
      <Box padding="4" bg={bg} maxW="6xl" maxH="4xl" resize="both" overflow="auto">
        <OrederRefillComp
          submitCallback={x => postOrderRefill(x)}
          locationId={0}></OrederRefillComp>
      </Box>
    </Container>
  );
};

export const getStaticProps: GetStaticProps<I18nProps<Locale>> = async context => {
  const locale = context.locale || context.defaultLocale;

  const { table = {} } = await import(`../../i18n/${locale}`);
  return { props: { table } };
};

export default DemoPage;
