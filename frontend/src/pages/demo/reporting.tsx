import { Container, VStack } from "@chakra-ui/react";
import ReportingComp from "components/Reporting/ReportingComponent";
import { NextPage } from "next";

const DemoPage: NextPage = () => {
  return (
    <Container maxW="xl" centerContent>
      <ReportingComp
        carId="12345"
        locations={["Building 1", "Building 2", "Building 3"]}
        couponNumbers={["Coupon 1", "Coupon 2", "Coupon 3"]}
        fillType={["Oil", "Gas", "Whatever"]}></ReportingComp>
    </Container>
  );
};

export default DemoPage;
