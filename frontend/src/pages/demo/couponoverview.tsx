import { Box, Container, useColorModeValue } from "@chakra-ui/react";
import CouponOverviewComp from "components/CouponOverview/CouponOverviewComponent";
import { NextPage } from "next";

const DemoPage: NextPage = () => {
  const bg = useColorModeValue("gray.100", "gray.700");

  return (
    <Container maxW="xl" centerContent>
      <Box padding="4" bg={bg} maxW="6xl" maxH="4xl" resize="both" overflow="auto">
        <CouponOverviewComp
          car="123"
          coupons={[
            { start: 1, end: 7, id: "1" },
            { start: 13, end: 25, id: "2" },
            { start: 2173, end: 2340, id: "3" }
          ]}></CouponOverviewComp>
      </Box>
    </Container>
  );
};

export default DemoPage;
