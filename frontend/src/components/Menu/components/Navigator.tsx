import { Box, Collapse, HStack, Text, VStack } from "@chakra-ui/react";
import { UserTypeContext } from "contexts/UserTypeContext";
import { useColors } from "hooks/useColors";
import { Locale } from "i18n/Locale";
import Link from "next/link";
import { useI18n } from "next-rosetta";
import { FC, useContext, useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

import { MenuLink as ILink } from "../MenuLink";
import MenuLink from "./MenuLink";
import styles from "./styles.module.css";

type Props = {
  links: ILink[];
};

const Navigator: FC<Props> = ({ links }) => {
  const { hoverBg } = useColors();

  const [selected, setSelected] = useState<string>(null);

  const { activeUser } = useContext(UserTypeContext);

  const { t } = useI18n<Locale>();

  return (
    <nav className={styles.nav}>
      {links
        .filter(x => activeUser.currentRole.actions.includes(x.access))
        .map(link =>
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
                          background: hoverBg
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
              <Box>
                <MenuLink link={link} />
              </Box>
            </Link>
          )
        )}
    </nav>
  );
};

export default Navigator;
