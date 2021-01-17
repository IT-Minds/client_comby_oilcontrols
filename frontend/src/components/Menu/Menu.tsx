import { Box, Center, Flex, useColorModeValue } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

import MyUserSnippet from "./components/MyUserSnippet";
import Navigator from "./components/Navigator";
import { MenuLink } from "./MenuLink";

type Props = {
  links: MenuLink[];
};

const Menu: FC<Props> = ({ links }) => {
  const bg = useColorModeValue("gray.100", "gray.700");
  const hoverbg = useColorModeValue("blue.50", "blue.700");

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
            <Image
              src="/images/logo.webp"
              alt="Main Logo"
              width={400}
              height={100}
              quality={90}
              objectFit="contain"
            />
          </Link>
        </Center>
      </Box>
      <Box flexGrow={1} minH={0}>
        <Navigator links={links} />
      </Box>
      <MyUserSnippet />
    </Flex>
  );
};

export default Menu;
