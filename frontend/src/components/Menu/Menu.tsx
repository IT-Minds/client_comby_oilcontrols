import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
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
    <Flex bg={bg} direction="column" h={"100vh"} maxH={"100vh"}>
      <Box
        _hover={{
          background: hoverbg
        }}
        cursor="pointer"
        padding={8}
        paddingBottom={2}
        paddingTop={2}>
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

        {/* <Text>Image</Text> */}
      </Box>
      <Box flexGrow={1} minH={0}>
        <Navigator links={links} />
      </Box>
      <Box>
        <MyUserSnippet />
      </Box>
    </Flex>
  );
};

export default Menu;
