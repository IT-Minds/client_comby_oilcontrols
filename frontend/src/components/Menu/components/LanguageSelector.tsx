import {
  HStack,
  Image,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import { useColors } from "hooks/useColors";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FC, useEffect } from "react";

const localeMap = {
  "en-US": "English (US)",
  "da-DK": "Dansk",
  "kl-GL": "Kalaallisut"
};

const LanguageSelector: FC = () => {
  const { locale, locales, route, events, query } = useRouter();
  const { hoverBg } = useColors();

  const disclosure = useDisclosure();

  useEffect(() => {
    events.on("routeChangeStart", () => {
      disclosure.onClose();
    });
  }, []);

  return (
    <Popover {...disclosure}>
      <PopoverTrigger>
        <Image
          src={"/images/locales/" + locale + ".png"}
          alt="My Profile Picture"
          width={8}
          height={8}
          quality={90}
          objectFit="contain"
          borderRadius={10}
          _hover={{
            bg: hoverBg
          }}
          padding={1}
          cursor="pointer"
        />
      </PopoverTrigger>
      <PopoverContent w={"66%"} marginLeft={12}>
        {/* <PopoverHeader fontWeight="semibold">Locale</PopoverHeader> */}
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody marginTop={4}>
          <VStack align="flex-end ">
            {locales?.map(loc => (
              <Link
                href={{
                  pathname: route,
                  query
                }}
                locale={loc}
                key={loc}
                passHref>
                <HStack
                  cursor="pointer"
                  _hover={{
                    background: hoverBg
                  }}
                  padding={1}
                  spacing={1}
                  borderRadius={10}>
                  <Text>{localeMap[loc as keyof typeof localeMap]}</Text>
                  <Image
                    src={"/images/locales/" + loc + ".png"}
                    alt="My Profile Picture"
                    width={8}
                    height={8}
                    quality={90}
                    objectFit="contain"
                    borderRadius="full"
                  />
                </HStack>
              </Link>
            ))}
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
export default LanguageSelector;
