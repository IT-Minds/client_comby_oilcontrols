import {
  Collapse,
  Flex,
  HStack,
  Image,
  Spacer,
  StackDivider,
  Text,
  Tooltip,
  useColorModeValue,
  VStack
} from "@chakra-ui/react";
import ColorModeToggle from "components/ColorModeToggle/ColorModeToggle";
import Link from "next/link";
import React, { FC, useState } from "react";

const MyUserSnippet: FC = () => {
  const bg = useColorModeValue("gray.200", "gray.900");
  const hoverbg = useColorModeValue("blue.100", "blue.700");
  const borderColor = useColorModeValue("gray.400", "gray.700");

  const [isActive, setIsActive] = useState(false);

  return (
    <VStack alignItems="left" bg={bg} spacing={0}>
      <HStack
        padding={4}
        onClick={() => setIsActive(!isActive)}
        _hover={{
          background: hoverbg
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
        <VStack spacing={0} alignItems="left" maxW={"200px"}>
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
                background: hoverbg
              }}
              padding={1}
              paddingLeft={8}>
              <Text>Edit Info</Text>
            </HStack>
          </Link>
          <Link href="/" passHref>
            <HStack
              cursor="pointer"
              _hover={{
                background: hoverbg
              }}
              padding={1}
              paddingLeft={8}>
              <Text>Logout</Text>
            </HStack>
          </Link>
          <Flex padding={2}>
            <Spacer />
            <Tooltip label="Change Theme" fontSize="md" hasArrow placement="top" shouldWrapChildren>
              <ColorModeToggle />
            </Tooltip>
          </Flex>
        </VStack>
      </Collapse>
    </VStack>
  );
};

export default MyUserSnippet;
