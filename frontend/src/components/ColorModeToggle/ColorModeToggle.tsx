import { IconButton, IconButtonProps, useColorMode } from "@chakra-ui/react";
import { FC } from "react";
import { MdBrightnessHigh, MdBrightnessLow } from "react-icons/md";

const ColorModeToggle: FC<Partial<IconButtonProps>> = ({ ...rest }) => {
  const { toggleColorMode, colorMode } = useColorMode();

  return (
    <IconButton
      size="sm"
      onClick={toggleColorMode}
      aria-label="Change color mode"
      {...rest}
      icon={colorMode === "light" ? <MdBrightnessLow /> : <MdBrightnessHigh />}
    />
  );
};

export default ColorModeToggle;
