import { Box, Container, useColorModeValue, useToast } from "@chakra-ui/react";
import FillOutRefillForm from "components/FillOutRefillForm/FillOutRefillForm";
import { RefillForm } from "components/FillOutRefillForm/RefillForm";
import { useOffline } from "hooks/useOffline";
import { Locale } from "i18n/Locale";
import { GetStaticProps, NextPage } from "next";
import { I18nProps } from "next-rosetta";
import { useCallback } from "react";
import { genRefillClient } from "services/backend/apiClients";
import { CompleteRefillCommand, TankState } from "services/backend/nswagts";
import { urlToFile } from "utils/urlToFile";

const couponNumbers = [
  { name: "Coupon 1", id: "1" },
  { name: "Coupon 2", id: "2" },
  { name: "Coupon 3", id: "3" }
];

const DemoPage: NextPage = () => {
  const toast = useToast();

  const { awaitCallback } = useOffline();

  const bg = useColorModeValue("gray.100", "gray.700");

  const saveForm = useCallback(
    (reportForm: RefillForm) => {
      awaitCallback(async () => {
        const client = await genRefillClient();
        const newRefillID = await client.complete(
          2,
          new CompleteRefillCommand({
            couponNumber: Number(reportForm.couponId),
            actualDeliveryDate: new Date(),
            startAmount: 2,
            endAmount: 20,
            tankState: TankState.FULL
          })
        );

        const fileName = await client.saveCouponImage(newRefillID, {
          data: await urlToFile(reportForm.image, "temp.webp", "image/webp"),
          fileName: "temp.webp"
        });

        toast({
          title: "Form created.",
          description: fileName,
          status: "success",
          duration: 9000,
          isClosable: true
        });
      }, Date.now().toString());
    },
    [awaitCallback]
  );

  return (
    <Container maxW="100%" maxH="100%" centerContent>
      <Box padding="4" bg={bg} maxW="6xl" maxH="4xl" resize="both" overflow="auto">
        <FillOutRefillForm submitCallback={saveForm} couponNumbers={couponNumbers} />
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
