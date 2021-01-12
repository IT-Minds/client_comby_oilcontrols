import { Box, Container, useToast } from "@chakra-ui/react";
import ReportingComp from "components/Reporting/ReportingComponent";
import { useOffline } from "hooks/useOffline";
import { NextPage } from "next";
import { useCallback } from "react";
import { genRefillClient } from "services/backend/apiClients";
import { CreateRefillCommand, TankState, TankType } from "services/backend/nswagts";
import { urlToFile } from "utils/urlToFile";

const DemoPage: NextPage = () => {
  const toast = useToast();

  const { awaitCallback } = useOffline();

  const saveForm = useCallback(
    async reportForm => {
      awaitCallback(async () => {
        const client = genRefillClient();
        const newRefillID = await client.create(
          new CreateRefillCommand({
            couponNumber: Number(reportForm.couponId),
            date: new Date(),
            fuelType: reportForm.fuelType,
            startAmount: 2,
            endAmount: 0 + reportForm.liters,
            tankNumber: 123,
            tankState: TankState.FULL,
            tankType: TankType.BUILDING,
            truckId: Number(reportForm.carId)
          })
        );

        const fileName = await client.createProjectFile(newRefillID, {
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
      <Box padding="4" bg="gray.100" maxW="6xl" maxH="4xl" resize="both" overflow="auto">
        <ReportingComp
          submitCallback={x => saveForm(x)}
          carId="2"
          locations={[
            { name: "Build 1", id: "1" },
            { name: "Build 2", id: "2" },
            { name: "Build 3", id: "3" }
          ]}
          couponNumbers={[
            { name: "Coupon 1", id: "1" },
            { name: "Coupon 2", id: "2" },
            { name: "Coupon 3", id: "3" }
          ]}></ReportingComp>
      </Box>
    </Container>
  );
};

export default DemoPage;
