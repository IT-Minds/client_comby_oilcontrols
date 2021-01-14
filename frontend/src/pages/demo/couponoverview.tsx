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
            { start: "1", end: "7", id: "1" },
            { start: "13", end: "25", id: "2" },
            { start: "2173", end: "2340", id: "3" }
          ]}></CouponOverviewComp>
      </Box>
    </Container>
  );
};

export default DemoPage;
