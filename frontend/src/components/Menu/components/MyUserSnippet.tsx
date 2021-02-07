import {
  Box,
  Collapse,
  Flex,
  HStack,
  Image,
  Spacer,
  StackDivider,
  Text,
  Tooltip,
  useBreakpointValue,
  useColorModeValue,
  VStack
} from "@chakra-ui/react";
import ColorModeToggle from "components/ColorModeToggle/ColorModeToggle";
import { UserTypeContext } from "contexts/UserTypeContext";
import { useColors } from "hooks/useColors";
import { Locale } from "i18n/Locale";
import Link from "next/link";
import { useI18n } from "next-rosetta";
import React, { FC, useContext, useState } from "react";

import AppVersion from "./AppVersion";
import LanguageSelector from "./LanguageSelector";
import UserTypeSwitcher from "./UserTypeSwitcher";

type Props = {
  forceOpen?: boolean;
};

const MyUserSnippet: FC<Props> = ({ forceOpen = false }) => {
  const bg = useColorModeValue("gray.200", "gray.900");
  const { hoverBg } = useColors();
  const borderColor = useColorModeValue("gray.400", "gray.700");
  const nameLength = useBreakpointValue({ base: 150, lg: 200 });
  const { t } = useI18n<Locale>();

  const [isActive, setIsActive] = useState(forceOpen);

  const { logout } = useContext(UserTypeContext);

  return (
    <VStack alignItems="left" bg={bg} spacing={0}>
      <HStack
        padding={4}
        onClick={() => setIsActive(forceOpen || !isActive)}
        _hover={{
          background: hoverBg
        }}
        cursor="pointer"
        borderColor={borderColor}
        borderBottom={"1px"}>
        <Image
          src="https://picsum.photos/100/100"
          alt="My Profile Picture"
          width={12}
          height={12}
          quality={90}
          objectFit="contain"
          borderRadius="full"
        />
        <VStack spacing={0} alignItems="left" maxW={nameLength + "px"}>
          <Text isTruncated>My Full Name Is very long so it should cut it off</Text>
          <Text size="xs" isTruncated as="i">
            My title
          </Text>
        </VStack>
      </HStack>

      <Collapse in={isActive} animateOpacity>
        <StackDivider borderColor={borderColor} />
        <VStack alignItems="left" spacing={0} divider={<StackDivider borderColor={borderColor} />}>
          <Link href="/" passHref>
            <HStack
              cursor="pointer"
              _hover={{
                background: hoverBg
              }}
              padding={1}
              paddingLeft={8}>
              <Text>{t("user.editInfo")}</Text>
            </HStack>
          </Link>
          <HStack
            cursor="pointer"
            _hover={{
              background: hoverBg
            }}
            padding={1}
            paddingLeft={8}
            onClick={logout}>
            <Text>{t("user.logout")}</Text>
          </HStack>
          <Box
            cursor="pointer"
            _hover={{
              background: hoverBg
            }}
            padding={1}
            paddingLeft={8}>
            <UserTypeSwitcher />
          </Box>

          <Flex padding={1} paddingLeft={8} align="center">
            <Spacer />
            <Box marginRight={2}>
              <LanguageSelector />
            </Box>
            <Tooltip
              label={t("user.theme")}
              fontSize="md"
              hasArrow
              placement="top"
              shouldWrapChildren>
              <ColorModeToggle />
            </Tooltip>
          </Flex>
          <AppVersion />
        </VStack>
      </Collapse>
    </VStack>
  );
};

export default MyUserSnippet;
