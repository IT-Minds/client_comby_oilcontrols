import { Collapse, Flex, HStack, Text, useColorModeValue, VStack } from "@chakra-ui/react";
import Link from "next/link";
import React, { FC, useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

import { MenuLink } from "../MenuLink";
import styles from "./styles.module.css";

type Props = {
  links: MenuLink[];
};

const LINK_PAD = 6;
const SUB_LINK_PAD = LINK_PAD + 10;

const Navigator: FC<Props> = ({ links }) => {
  const hoverbg = useColorModeValue("blue.100", "blue.700");

  const [selected, setSelected] = useState<string>(null);

  return (
    <nav className={styles.nav}>
      {links.map(link =>
        link.children && link.children.length > 0 ? (
          <VStack key={link.id} alignItems="left" spacing={0}>
            <Flex
              cursor="pointer"
              onClick={() => setSelected(selected === link.id ? null : link.id)}
              _hover={{
                background: hoverbg
              }}
              padding={2}
              paddingLeft={LINK_PAD}
              align="center">
              <link.logo />

              <Text flexGrow={1} ml={2}>
                {link.title}
              </Text>

              {selected === link.id ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
            </Flex>

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
                      paddingLeft={SUB_LINK_PAD}>
                      <Text>{childLink.title}</Text>
                    </HStack>
                  </Link>
                ))}
              </VStack>
            </Collapse>
          </VStack>
        ) : (
          <Link href={link.href} passHref key={link.id}>
            <HStack
              cursor="pointer"
              _hover={{
                background: hoverbg
              }}
              padding={2}
              paddingLeft={LINK_PAD}>
              <link.logo />

              <Text>{link.title}</Text>
            </HStack>
          </Link>
        )
      )}
    </nav>
  );
};

export default Navigator;
