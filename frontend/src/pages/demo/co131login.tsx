import { Box, Container, useColorModeValue, useToast } from "@chakra-ui/react";
import LoginComp from "components/Login/LoginComp";
import { useOffline } from "hooks/useOffline";
import { Locale } from "i18n/Locale";
import { GetStaticProps, NextPage } from "next";
import { I18nProps } from "next-rosetta";
import { useCallback } from "react";
import { genAuthenticationClient } from "services/backend/apiClients";
import { AssignTokenCommand, IUserDto } from "services/backend/nswagts";

const DemoPage: NextPage = () => {
  const toast = useToast();
  const { awaitCallback } = useOffline();
  const bg = useColorModeValue("gray.100", "gray.700");

  const login = useCallback(
    async (form: IUserDto) => {
      awaitCallback(async () => {
        const client = await genAuthenticationClient();
        await client.login(
          new AssignTokenCommand({
            userDto: {
              username: form.username,
              password: form.password
            }
          })
        );

        toast({
          title: "Login successful",
          description: "Successful",
          status: "success",
          duration: 9000,
          isClosable: true
        });
      }, Date.now().toString());
    },
    [awaitCallback]
  );

  return (
    <Container maxW="xl" centerContent>
      <Box padding="4" bg={bg} maxW="6xl" maxH="4xl" resize="both" overflow="auto">
        <LoginComp submitCallback={x => login(x)}></LoginComp>
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