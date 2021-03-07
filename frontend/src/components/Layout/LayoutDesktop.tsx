import {
  Box,
  Container,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  forwardRef,
  HStack,
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

const LayoutDesktop = forwardRef(({ children }, ref) => {
  const displaymenu = useBreakpointValue({ base: false, md: true });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { activeUser } = useContext(UserTypeContext);

  const router = useRouter();

  useEffect(() => {
    if (!displaymenu) {
      router.events.on("routeChangeStart", () => {
        onClose();
      });
    }
  }, [displaymenu]);

  return (
    <>
      {/* MOBILE */}
      {!displaymenu && (
        <Box padding={2} position="absolute" left={1}>
          <IconButton
            size="sm"
            onClick={onOpen}
            aria-label="Open Menu Drawer"
            icon={<MdSort />}
            _focus={{
              border: 0
            }}
          />
        </Box>
      )}
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

      {/* DESKTOP TRUCK */}
      {displaymenu && activeUser.isTrucker && (
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
      )}

      <HStack h="100vh">
        {displaymenu && !activeUser.isTrucker && (
          <Box h="100%" w="280px">
            <Menu links={testLinks} />
          </Box>
        )}

        <Container
          ref={ref}
          maxW="unset"
          w="100%"
          h="100%"
          flexShrink={1}
          overflowY="auto"
          centerContent
          padding={displaymenu ? 1 : 2}
          paddingTop={displaymenu ? 1 : 8}>
          {children}
        </Container>
      </HStack>
    </>
  );
});

export default LayoutDesktop;
