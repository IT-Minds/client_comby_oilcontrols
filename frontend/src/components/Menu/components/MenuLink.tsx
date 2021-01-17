import { Flex, FlexOptions, Text, useColorModeValue } from "@chakra-ui/react";
import { Locale } from "i18n/Locale";
import { useI18n } from "next-rosetta";
import { FC, MouseEvent } from "react";

import { MenuLink as ILink } from "../MenuLink";

type PropsNav = {
  link: ILink;
  onClick?: (event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => void;
};

const MenuLink: FC<PropsNav & Partial<FlexOptions>> = ({ children, link, onClick }) => {
  const hoverbg = useColorModeValue("blue.100", "blue.700");

  const { t } = useI18n<Locale>();

  return (
    <Flex
      cursor="pointer"
      onClick={onClick}
      _hover={{
        background: hoverbg
      }}
      padding={2}
      paddingLeft={6}
      align="center">
      <link.logo />

      <Text flexGrow={1} ml={2} userSelect="none">
        {t(link.title)}
      </Text>

      {children}
    </Flex>
  );
};

export default MenuLink;
