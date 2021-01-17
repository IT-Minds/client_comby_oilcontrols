import { Box, Center, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { UserTypeContext } from "contexts/UserTypeContext";
import Image from "next/image";
import Link from "next/link";
import { FC, forwardRef, ForwardRefRenderFunction, useContext } from "react";
import { UserType } from "types/UserType";

import MyUserSnippet from "./components/MyUserSnippet";
import Navigator from "./components/Navigator";
import { MenuLink } from "./MenuLink";

type Props = {
  links: MenuLink[];
};

const Menu: FC<Props> = ({ links }) => {
  const bg = useColorModeValue("gray.100", "gray.700");
  const hoverbg = useColorModeValue("blue.50", "blue.700");

  const { isType } = useContext(UserTypeContext);

  return (
    <Flex bg={bg} direction="column" h={"100%"} maxH={"100vh"} w="100%">
      <Box
        _hover={{
          background: hoverbg
        }}
        cursor="pointer"
        padding={8}
        paddingBottom={2}
        paddingTop={2}>
        <Center>
          <Link href="/" passHref>
            <Box>
              <Image
                src="/images/logo.webp"
                alt="Main Logo"
                width={400}
                height={100}
                quality={90}
                objectFit="contain"
              />
            </Box>
          </Link>
        </Center>
      </Box>
      <Box flexGrow={1} minH={0}>
        {isType(UserType.OFFICE_WORKER) ? <Navigator links={links} /> : <Text>DRIVER</Text>}
      </Box>
      <MyUserSnippet />
    </Flex>
  );
};

export default Menu;
