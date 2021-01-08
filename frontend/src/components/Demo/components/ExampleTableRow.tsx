import { Badge, Td, Tr, useToast, useToken } from "@chakra-ui/react";
import React, { FC } from "react";
import { ExampleEntityDto, ExampleEnum } from "services/backend/nswagts";

type Props = {
  rowData: ExampleEntityDto;
};

const ExampleTableRow: FC<Props> = ({ rowData }) => {
  const toast = useToast();
  const hoverColor = useToken(
    // the key within the theme, in this case `theme.colors`
    "colors",
    // the subkey(s), resolving to `theme.colors.red.100`
    "teal.100"
    // a single fallback or fallback array matching the length of the previous arg
  );
  return (
    <Tr
      key={rowData.id}
      _hover={{ bg: hoverColor, cursor: "pointer" }}
      onClick={
        () =>
          toast({
            position: "bottom-left",
            title: "Clicked row",
            description: JSON.stringify(rowData)
          })

        // logger.debug("Click row!", dat)
      }>
      <Td isNumeric>{rowData.id}</Td>
      <Td width="15ch">{rowData.name}</Td>
      <Td>
        <Badge colorScheme="green" variant="outline">
          {ExampleEnum[rowData.exampleEnum]}
        </Badge>
      </Td>
    </Tr>
  );
};

export default ExampleTableRow;
