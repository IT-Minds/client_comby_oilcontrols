import { IconButton, IconButtonProps, useColorMode } from "@chakra-ui/react";
import { FC } from "react";
import { IoMdMoon, IoMdSunny } from "react-icons/io";

const ColorModeToggle: FC<Partial<IconButtonProps>> = ({ ...rest }) => {
  const { toggleColorMode, colorMode } = useColorMode();

  return (
    <IconButton
      size="sm"
      onClick={toggleColorMode}
      aria-label="Change color mode"
      {...rest}
      icon={colorMode === "light" ? <IoMdMoon /> : <IoMdSunny />}
    />
  );
};

export default ColorModeToggle;
