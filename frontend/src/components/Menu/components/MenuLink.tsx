import { Flex, FlexOptions, Text } from "@chakra-ui/react";
import { useColors } from "hooks/useColors";
import { Locale } from "i18n/Locale";
import { useI18n } from "next-rosetta";
import { FC, MouseEvent } from "react";

import { MenuLink as ILink } from "../MenuLink";

type PropsNav = {
  link: ILink;
  onClick?: (event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => void;
};

const MenuLink: FC<PropsNav & Partial<FlexOptions>> = ({ children, link, onClick }) => {
  const { hoverBg } = useColors();

  const { t } = useI18n<Locale>();

  return (
    <Flex
      cursor="pointer"
      onClick={onClick}
      _hover={{
        background: hoverBg
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
