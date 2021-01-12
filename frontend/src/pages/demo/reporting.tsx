import { Box, Container, useToast } from "@chakra-ui/react";
import { ReportForm } from "components/Reporting/ReportForm";
import ReportingComp from "components/Reporting/ReportingComponent";
import { NextPage } from "next";
import { useEffect, useState } from "react";

const DemoPage: NextPage = () => {
  const [reportForm, setReportForm] = useState<ReportForm>(null);
  const toast = useToast();

  useEffect(() => {
    if (reportForm) {
      toast({
        title: "Account created.",
        description: JSON.stringify(
          reportForm,
          (name, val) => (name !== "image" ? val : `${val.substr(0, 15)}...${val.substr(-5)}`),
          2
        ),
        status: "success",
        duration: 9000,
        isClosable: true
      });
    }
  }, [reportForm]);

  return (
    <Container maxW="xl" centerContent>
      <Box padding="4" bg="gray.100" maxW="6xl" maxH="4xl" resize="both" overflow="auto">
        <ReportingComp
          submitCallback={x => setReportForm(x)}
          carId="12345"
          locations={[
            { name: "Build 1", id: "1" },
            { name: "Build 2", id: "2" },
            { name: "Build 3", id: "3" }
          ]}
          couponNumbers={[
            { name: "Coupon 1", id: "1" },
            { name: "Coupon 2", id: "2" },
            { name: "Coupon 3", id: "3" }
          ]}
          fillTypes={[
            { name: "Oil", id: "1" },
            { name: "Gas", id: "2" },
            { name: "Something else", id: "3" }
          ]}></ReportingComp>
      </Box>
    </Container>
  );
};

export default DemoPage;
