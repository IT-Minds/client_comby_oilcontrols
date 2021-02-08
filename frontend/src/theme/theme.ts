import { ColorMode, extendTheme } from "@chakra-ui/react";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false
} as {
  initialColorMode: ColorMode;
  useSystemColorMode: boolean;
};

const colors = {};

const theme = extendTheme({ config, colors });
export default theme;
