import {
  Box,
  Input,
  InputGroup,
  InputRightElement,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
  useColorModeValue,
  useToken,
  VStack
} from "@chakra-ui/react";
import { useColors } from "hooks/useColors";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import DropdownType from "types/DropdownType";

import styles from "./styles.module.css";

type Props = {
  placeholder?: string;
  options: DropdownType[];
  onSelect?: (selected: DropdownType) => void;
  isLoading?: boolean;
};

const LIGHT = "blue.500";
const DARK = "blue.300";

const ComboSelect: FC<Props> = ({
  placeholder = "Click to enable combo box",
  options,
  onSelect = () => null,
  isLoading = false
}) => {
  const [active, setActive] = useState(false);
  const [activeItem, setActiveItem] = useState<DropdownType>(null);
  const [searchValue, setSeachValue] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const focusRef = useRef<number>(-1);

  const { hoverBg: hoverbg } = useColors();
  const borderColorToken = useColorModeValue(LIGHT, DARK);
  const [lightColor, darkColor] = useToken("colors", [LIGHT, DARK]);
  const borderColor = useMemo(() => {
    if (borderColorToken === LIGHT) return lightColor;
    if (borderColorToken === DARK) return darkColor;
  }, [lightColor, darkColor, borderColorToken]);

  const filteredOptions = useMemo(() => options.filter(x => x.name.indexOf(searchValue) !== -1), [
    searchValue
  ]);

  const select = useCallback((item: DropdownType) => {
    setSeachValue(item.name);
    setActiveItem(item);
    setActive(false);
    onSelect(item);
    inputRef.current.focus();
  }, []);

  const focusElement = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, item: DropdownType) => {
      if (active) {
        const keyValue = e.code;
        console.log(keyValue);
        if (keyValue === "ArrowDown") {
          if (focusRef.current >= filteredOptions.length - 1) focusRef.current = -1;
          const id = "#combobox" + ++focusRef.current;

          const element = stackRef.current.querySelector(id);
          console.log(id, element);

          (element as HTMLInputElement)?.focus();
        } else if (keyValue === "ArrowUp") {
          if (focusRef.current <= 0) focusRef.current = filteredOptions.length;
          const id = "#combobox" + --focusRef.current;

          const element = stackRef.current.querySelector(id);
          console.log(id, element);

          (element as HTMLInputElement)?.focus();
        } else if (keyValue === "Enter" || keyValue === "Space") {
          if (item !== null) select(item);
        }
        // else setSeachValue(str => str + e.key);
      }
    },
    [active, filteredOptions]
  );

  useEffect(() => {
    focusRef.current = -1;
  }, [active]);

  return (
    <Box className={styles.comboBox}>
      <Popover
        isOpen={active}
        // onClose={() => setActive(false)}
        placement="bottom"
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={false}
        gutter={0}>
        <PopoverTrigger>
          <InputGroup onClick={() => setActive(true)}>
            <Input
              isReadOnly={!active}
              value={active ? searchValue : activeItem?.name ?? placeholder}
              onChange={e => setSeachValue(e.target.value)}
              onKeyDown={e => focusElement(e, null)}
              ref={inputRef}
            />
            <InputRightElement>
              <MdKeyboardArrowDown onClick={() => setActive(!active)} />
            </InputRightElement>
          </InputGroup>
        </PopoverTrigger>
        <PopoverContent
          mt={"-4px"}
          borderTop="none"
          borderTopLeftRadius="0"
          borderTopRightRadius="0"
          borderColor={borderColor}
          boxShadow={"0 1px 0 1px " + borderColor}>
          <PopoverBody>
            <VStack align="left" minH={30} maxH={60} overflowY="auto" ref={stackRef} spacing={0}>
              {filteredOptions.map((x, i) => (
                <Input
                  isLazy
                  variant="flushed"
                  readOnly
                  id={"combobox" + i}
                  key={x.id}
                  onClick={() => select(x)}
                  tabindex="-1"
                  cursor="pointer"
                  userSelect="none"
                  onKeyDown={e => focusElement(e, x)}
                  p={2}
                  _focus={{
                    background: hoverbg
                  }}
                  _hover={{
                    background: hoverbg
                  }}
                  value={x.name}
                />
              ))}
              {isLoading && <Skeleton minH={8} />}
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
};

export default ComboSelect;
