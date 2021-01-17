import { Collapse, HStack, Text, useColorModeValue, VStack } from "@chakra-ui/react";
import { Locale } from "i18n/Locale";
import Link from "next/link";
import { useI18n } from "next-rosetta";
import { FC, useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

import { MenuLink as ILink } from "../MenuLink";
import MenuLink from "./MenuLink";
import styles from "./styles.module.css";

type Props = {
  links: ILink[];
};

const Navigator: FC<Props> = ({ links }) => {
  const hoverbg = useColorModeValue("blue.100", "blue.700");

  const [selected, setSelected] = useState<string>(null);

  const { t } = useI18n<Locale>();

  return (
    <nav className={styles.nav}>
      {links.map(link =>
        link.children && link.children.length > 0 ? (
          <VStack key={link.id} alignItems="left" spacing={0}>
            <MenuLink
              link={link}
              onClick={() => setSelected(selected === link.id ? null : link.id)}
              align="center">
              {selected === link.id ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
            </MenuLink>

            <Collapse in={selected === link.id} animateOpacity>
              <VStack alignItems="left" spacing={0}>
                {link.children.map(childLink => (
                  <Link href={childLink.href} passHref key={childLink.id}>
                    <HStack
                      cursor="pointer"
                      _hover={{
                        background: hoverbg
                      }}
                      padding={1}
                      paddingLeft={16}>
                      <Text userSelect="none">{t(childLink.title)}</Text>
                    </HStack>
                  </Link>
                ))}
              </VStack>
            </Collapse>
          </VStack>
        ) : (
          <Link href={link.href} passHref key={link.id}>
            <MenuLink link={link} />
          </Link>
        )
      )}
    </nav>
  );
};

export default Navigator;
