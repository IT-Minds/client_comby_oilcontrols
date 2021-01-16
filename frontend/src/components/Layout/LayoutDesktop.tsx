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
        <Box className={styles.mobile} padding={2} position="absolute" left={2}>
          <IconButton size="sm" onClick={onOpen} aria-label="Change color mode" icon={<MdSort />} />
        </Box>
      )}

      <Container maxW="xl" centerContent>
        {children}
      </Container>

      <Drawer isOpen={isOpen} size="full" onClose={onClose} placement="top">
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton position="fixed" left={2} />

            <DrawerBody padding={0}>
              <Menu links={testLinks} />
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Flex>
  );
};

export default LayoutDesktop;
