import { Box, Container, useColorModeValue, useToast } from "@chakra-ui/react";
import OrederRefillComp from "components/OrderRefill/OrderRefillComp";
import { OrderRefillForm } from "components/OrderRefill/OrderRefillForm";
import { Locale } from "i18n/Locale";
import { GetStaticProps, NextPage } from "next";
import { I18nProps } from "next-rosetta";
import { useEffect, useState } from "react";

const DemoPage: NextPage = () => {
  const [orderRefillForm, setOrderRefillForm] = useState<OrderRefillForm>(null);
  const toast = useToast();
  const bg = useColorModeValue("gray.100", "gray.700");

  useEffect(() => {
    if (orderRefillForm) {
      toast({
        title: "Refill ordered",
        description: JSON.stringify(orderRefillForm),
        status: "success",
        duration: 9000,
        isClosable: true
      });
    }
  }, [orderRefillForm]);

  return (
    <Container maxW="xl" centerContent>
      <Box padding="4" bg={bg} maxW="6xl" maxH="4xl" resize="both" overflow="auto">
        <OrederRefillComp
          submitCallback={x => setOrderRefillForm(x)}
          locations={[
            { name: "Location 1", id: "1" },
            { name: "Location 2", id: "2" },
            { name: "Location 3", id: "3" }
          ]}></OrederRefillComp>
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
