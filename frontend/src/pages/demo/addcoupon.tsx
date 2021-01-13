import { Box, Container, useToast } from "@chakra-ui/react";
import AddCouponComp from "components/CouponManagement/AddCoupon/AddCouponComponent";
import { AddCouponForm } from "components/CouponManagement/AddCoupon/AddCouponForm";
import { NextPage } from "next";
import { useEffect, useState } from "react";

const DemoPage: NextPage = () => {
  const [addCouponForm, setCouponForm] = useState<AddCouponForm>(null);
  const toast = useToast();

  useEffect(() => {
    if (addCouponForm) {
      toast({
        title: "Coupon added",
        description: JSON.stringify(addCouponForm),
        status: "success",
        duration: 9000,
        isClosable: true
      });
    }
  }, [addCouponForm]);

  return (
    <Container maxW="xl" centerContent>
      <Box padding="4" bg="gray.100" maxW="6xl" maxH="4xl" resize="both" overflow="auto">
        <AddCouponComp
          submitCallback={x => setCouponForm(x)}
          cars={[
            { name: "Car 1", id: "1" },
            { name: "Car 2", id: "2" },
            { name: "Car 3", id: "3" }
          ]}></AddCouponComp>
      </Box>
    </Container>
  );
};

export default DemoPage;
