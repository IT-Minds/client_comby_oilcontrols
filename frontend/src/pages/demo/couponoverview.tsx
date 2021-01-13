import { Box, Container } from "@chakra-ui/react";
import CouponOverviewComp from "components/CouponOverview/CouponOverviewComponent";
import { NextPage } from "next";

const DemoPage: NextPage = () => {
  return (
    <Container maxW="xl" centerContent>
      <Box padding="4" bg="gray.100" maxW="6xl" maxH="4xl" resize="both" overflow="auto">
        <CouponOverviewComp
          car="123"
          coupons={[
            { from: "1", to: "7" },
            { from: "13", to: "25" },
            { from: "2173", to: "2340" }
          ]}></CouponOverviewComp>
      </Box>
    </Container>
  );
};

export default DemoPage;
