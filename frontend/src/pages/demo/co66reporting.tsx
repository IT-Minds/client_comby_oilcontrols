import { Box, Container, useColorModeValue, useToast } from "@chakra-ui/react";
import { ReportForm } from "components/Reporting/ReportForm";
import ReportingComp from "components/Reporting/ReportingComponent";
import { useOffline } from "hooks/useOffline";
import { Locale } from "i18n/Locale";
import { GetStaticProps, NextPage } from "next";
import { I18nProps } from "next-rosetta";
import { useCallback } from "react";
import { genRefillClient } from "services/backend/apiClients";
import { CreateRefillCommand, TankState, TankType } from "services/backend/nswagts";
import { urlToFile } from "utils/urlToFile";

const carId = "2";
const locations = [
  { name: "Build 1", id: "1" },
  { name: "Build 2", id: "2" },
  { name: "Build 3", id: "3" }
];
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
    (reportForm: ReportForm) => {
      awaitCallback(async () => {
        const client = await genRefillClient();
        const newRefillID = await client.create(
          new CreateRefillCommand({
            couponNumber: Number(reportForm.couponId),
            expectedDeliveryDate: new Date(),
            fuelType: reportForm.fuelType,
            startAmount: 2,
            endAmount: 0 + reportForm.liters,
            tankNumber: 123,
            tankState: TankState.FULL,
            tankType: TankType.BUILDING,
            truckId: Number(reportForm.carId)
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
        <ReportingComp
          submitCallback={saveForm}
          carId={carId}
          locations={locations}
          couponNumbers={couponNumbers}
        />
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
