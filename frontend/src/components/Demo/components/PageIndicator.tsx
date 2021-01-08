import { Button, HStack } from "@chakra-ui/react";
import React, { FC } from "react";

type Props = {
  pages: number[];
  activePage: number;
  onClickPage: (x: number) => void;
};

const PageIndicator: FC<Props> = ({ activePage, onClickPage, pages }) => {
  return (
    <HStack spacing="2" data-value={pages.length} margin="2">
      {pages.map(x => (
        <Button
          colorScheme="blue"
          size="sm"
          key={x}
          onClick={() => onClickPage(x)}
          variant={activePage === x ? "solid" : "outline"}>
          {x + 1}
        </Button>
      ))}
    </HStack>
  );
};

export default PageIndicator;
