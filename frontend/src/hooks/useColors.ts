import { useColorModeValue } from "@chakra-ui/react";

// ignore due to implied typing is better suited for this kind of hook
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useColors = () => {
  const hoverBg = useColorModeValue("blue.200", "blue.700");
  const menuBg = useColorModeValue("gray.100", "gray.700");

  return {
    hoverBg,
    menuBg
  };
};
