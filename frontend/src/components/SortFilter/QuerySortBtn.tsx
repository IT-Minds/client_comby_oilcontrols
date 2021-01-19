import { IconButton, IconButtonProps } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useState } from "react";
import { MdArrowDownward, MdArrowUpward, MdSort } from "react-icons/md";

export type Direction = "ASC" | "DESC";

type Props = {
  queryKey: string;
  queryGroup?: string;
  sortCb?: (key: string, direction: Direction) => void;
};

const QuerySortBtn: FC<Props & Partial<IconButtonProps>> = ({
  sortCb = () => null,
  queryKey,
  queryGroup = "t",
  ...rest
}) => {
  const [direction, setDirection] = useState<Direction>(null);
  const [active, setActive] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const sort = (router.query.thsort as string)?.split("_");

    if (sort && sort.length === 3) {
      const [checkQueryGroup, checkkey, direction] = sort;

      if (queryGroup === checkQueryGroup) {
        if (queryKey === checkkey) {
          setActive(true);
          setDirection(direction as Direction);
          sortCb(queryKey, direction as Direction);
        } else {
          setDirection(null);
          setActive(false);
        }
      }
    }
  }, [router, router.query]);

  const onClick = useCallback(() => {
    switch (direction) {
      case null: {
        router.replace(
          {
            query: { ...router.query, thsort: `${queryGroup}_${queryKey}_ASC` }
          },
          undefined,
          { shallow: true }
        );
        return;
      }
      case "ASC": {
        router.replace(
          {
            query: { ...router.query, thsort: `${queryGroup}_${queryKey}_DESC` }
          },
          undefined,
          { shallow: true }
        );
        return;
      }
      case "DESC": {
        const copy = { ...router.query };
        delete copy.thsort;
        router.replace(
          {
            query: copy
          },
          undefined,
          { shallow: true }
        );

        setActive(false);
        setDirection(null);
        sortCb(queryKey, null);
        return;
      }
    }
  }, [active, direction, router.query]);

  return (
    <IconButton
      size="xs"
      aria-label="Sort column"
      onClick={onClick}
      colorScheme={active ? "purple" : "gray"}
      icon={
        active ? (
          direction === "ASC" ? (
            <MdArrowUpward />
          ) : (
            <MdArrowDownward onClick={onClick} />
          )
        ) : (
          <MdSort onClick={onClick} />
        )
      }
      {...rest}
    />
  );
};

export default QuerySortBtn;
