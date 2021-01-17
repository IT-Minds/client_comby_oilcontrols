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
  useColorModeValue,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FC, useEffect } from "react";

const localeMap = {
  "en-US": "English (US)",
  "da-DK": "Dansk",
  "kl-GL": "Kalaallisut"
};

const LanguageSelector: FC = () => {
  const { locale, locales, route, events } = useRouter();
  const hoverbg = useColorModeValue("blue.100", "blue.700");

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
            bg: hoverbg
          }}
          padding={1}
          cursor="pointer"
        />
      </PopoverTrigger>
      <PopoverContent w={"75%"} marginLeft={9}>
        {/* <PopoverHeader fontWeight="semibold">Locale</PopoverHeader> */}
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody marginTop={4}>
          <VStack align="end">
            {locales?.map(loc => (
              <Link href={route} locale={loc} key={loc} passHref>
                <HStack
                  cursor="pointer"
                  _hover={{
                    background: hoverbg
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
