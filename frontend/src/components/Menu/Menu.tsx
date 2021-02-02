import { Box, Center, Flex, Text } from "@chakra-ui/react";
import { UserTypeContext } from "contexts/UserTypeContext";
import { useColors } from "hooks/useColors";
import Image from "next/image";
import Link from "next/link";
import { FC, useContext } from "react";
import { UserType } from "types/UserType";

import MyUserSnippet from "./components/MyUserSnippet";
import Navigator from "./components/Navigator";
import { MenuLink } from "./MenuLink";

type Props = {
  links: MenuLink[];
  userForceOpen?: boolean;
};

const Menu: FC<Props> = ({ links, userForceOpen = false }) => {
  const { hoverBg, menuBg } = useColors();

  const { isType } = useContext(UserTypeContext);

  return (
    <Flex bg={menuBg} direction="column" h={"100%"} maxH={"100vh"} w="100%">
      <Box
        _hover={{
          background: hoverBg
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
        {isType(UserType.OFFICE_WORKER) ? <Navigator links={links} /> : <Text></Text>}
      </Box>
      <MyUserSnippet forceOpen={userForceOpen} />
    </Flex>
  );
};

export default Menu;
