import {
  Box,
  Container,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  IconButton,
  useBreakpointValue,
  useDisclosure
} from "@chakra-ui/react";
import MyUserSnippet from "components/Menu/components/MyUserSnippet";
import Menu from "components/Menu/Menu";
import { testLinks } from "components/Menu/MenuLink";
import { UserTypeContext } from "contexts/UserTypeContext";
import Image from "next/image";
import { useRouter } from "next/router";
import { FC, useContext, useEffect } from "react";
import { MdSort } from "react-icons/md";
import { UserType } from "types/UserType";

import styles from "./styles.module.css";

const LayoutDesktop: FC = ({ children }) => {
  const displaymenu = useBreakpointValue({ base: false, md: true });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { isType } = useContext(UserTypeContext);

  const router = useRouter();

  useEffect(() => {
    if (!displaymenu) {
      router.events.on("routeChangeStart", () => {
        onClose();
      });
    }
  }, [displaymenu]);

  return (
    <Flex>
      {displaymenu ? (
        isType(UserType.OFFICE_WORKER) ? (
          <Box className={styles.desktop}>
            <Menu links={testLinks} />
          </Box>
        ) : (
          <>
            <Box position="fixed" bottom={0} zIndex={99}>
              <MyUserSnippet />
            </Box>

            <Box position="fixed" top={0} pl={2}>
              <Image
                src="/images/logo.webp"
                alt="Main Logo"
                width={200}
                height={60}
                quality={90}
                objectFit="contain"
              />
            </Box>
          </>
        )
      ) : (
        <Box className={styles.mobile} padding={2} position="absolute" left={1}>
          <IconButton
            size="sm"
            onClick={onOpen}
            aria-label="Change color mode"
            icon={<MdSort />}
            _focus={{
              border: 0
            }}
          />
        </Box>
      )}

      <Container
        maxW="5xl"
        centerContent
        padding={displaymenu ? 1 : 2}
        paddingTop={displaymenu ? 1 : 8}>
        {children}
      </Container>

      <Drawer isOpen={isOpen && !displaymenu} size="full" onClose={onClose} placement="top">
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton
              position="fixed"
              left={2}
              _focus={{
                border: 0
              }}
            />

            <DrawerBody padding={0}>
              <Box paddingTop={0} h={"100%"}>
                <Menu links={testLinks} userForceOpen={true} />
              </Box>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Flex>
  );
};

export default LayoutDesktop;
