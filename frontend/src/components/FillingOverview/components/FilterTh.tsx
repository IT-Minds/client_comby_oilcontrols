import {
  Button,
  Checkbox,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  useColorModeValue,
  VStack
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { MdFilterList } from "react-icons/md";
import DropdownType from "types/DropdownType";
import { queryToArr } from "utils/queryStringUtils";

type Props = {
  queryKey: string;
  queryGroup?: string;
  filterCb?: (qkey: string, chosenOptions: DropdownType["id"][]) => void;

  options: DropdownType[];
};

const FilterTh: FC<Props> = ({
  filterCb = () => null,
  queryKey,
  queryGroup = "table",
  options
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [checkedItems, setCheckedItems] = useState<DropdownType["id"][]>(options.map(x => x.id));

  const allChecked = useMemo(() => checkedItems.length === options.length, [checkedItems]);
  const isIndeterminate = useMemo(
    () => checkedItems.length > 0 && checkedItems.length !== options.length,
    [checkedItems]
  );

  const router = useRouter();

  useEffect(() => {
    const filters = queryToArr(router.query.thfilter ?? []);

    filters.forEach(filter => {
      const [checkQueryGroup, checkKey, ...values] = filter.split("_");

      console.log(filter);
      if (queryGroup === checkQueryGroup) {
        if (queryKey === checkKey) {
          setCheckedItems(values);
          filterCb(queryKey, values);
        }
      }
    });
  }, [router, router.query]);

  const onClick = useCallback(() => {
    const copy = { ...router.query };
    if (allChecked) {
      delete copy.thfilter;
      filterCb(queryKey, checkedItems);
    } else {
      copy["thfilter"] = `${queryGroup}_${queryKey}_${checkedItems.join("_")}`;
    }
    router.replace(
      {
        query: copy
      },
      undefined,
      { shallow: true }
    );
    setIsOpen(false);
  }, [checkedItems, allChecked, router.query]);

  return (
    <Popover isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <PopoverTrigger>
        <IconButton
          size="xs"
          aria-label="Filter column"
          onClick={() => setIsOpen(true)}
          icon={<MdFilterList />}
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Filter</PopoverHeader>
        <PopoverBody>
          <VStack align="left" h={[20, 40, 60]} overflowY="auto">
            <Checkbox
              isChecked={allChecked}
              isIndeterminate={isIndeterminate}
              onChange={() => setCheckedItems(allChecked ? [] : options.map(x => x.id))}>
              Select All
            </Checkbox>
            {options.map(o => (
              <Checkbox
                key={o.id}
                value={o.id}
                isChecked={checkedItems.includes(o.id)}
                onChange={() =>
                  setCheckedItems(
                    checkedItems.includes(o.id)
                      ? checkedItems.filter(x => x !== o.id)
                      : [...checkedItems, o.id]
                  )
                }>
                {o.name}
              </Checkbox>
            ))}
          </VStack>
        </PopoverBody>
        <PopoverFooter>
          <Button onClick={onClick}>Apply</Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};

export default FilterTh;
