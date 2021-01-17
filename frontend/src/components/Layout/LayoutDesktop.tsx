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
import Menu from "components/Menu/Menu";
import { testLinks } from "components/Menu/MenuLink";
import { useRouter } from "next/router";
import { FC, useEffect } from "react";
import { MdSort } from "react-icons/md";

import styles from "./styles.module.css";

const LayoutDesktop: FC = ({ children }) => {
  const displaymenu = useBreakpointValue({ base: false, md: true });

  const { isOpen, onOpen, onClose } = useDisclosure();

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
        <Box className={styles.desktop}>
          <Menu links={testLinks} />
        </Box>
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
        maxW="xl"
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
              <Box paddingTop={6} h={"100%"}>
                <Menu links={testLinks} />
              </Box>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Flex>
  );
};

export default LayoutDesktop;
