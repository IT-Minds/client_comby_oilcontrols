import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Select,
  Tag,
  TagCloseButton,
  TagLabel,
  VStack,
  Wrap,
  WrapItem
} from "@chakra-ui/react";
import React, { FC, FormEvent, useCallback, useState } from "react";
import { MdAdd, MdCheck } from "react-icons/md";
import { CouponInterval } from "types/CouponInterval";
import DropdownType from "types/DropdownType";
import { logger } from "utils/logger";

import { AddCouponForm } from "./AddCouponForm";

type Props = {
  submitCallback: (addCouponForm: AddCouponForm) => void;
  cars: DropdownType[];
};

const AddCouponComp: FC<Props> = ({ submitCallback, cars = [] }) => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [interval, setInterval] = useState<CouponInterval[]>([]);

  const [localAddCouponForm, setLocalAddCouponForm] = useState<AddCouponForm>({
    carId: "",
    couponIntervals: []
  });

  const [formSubmitAttempts, setFormSubmitAttempts] = useState(0);

  const updateLocalForm = useCallback((value: unknown, key: keyof AddCouponForm) => {
    setLocalAddCouponForm(form => {
      (form[key] as unknown) = value;
      return form;
    });
  }, []);

  const addInterval = (from: string, to: string) => {
    if (from != "" && to != "") {
      setInterval(oldArray => [...oldArray, { from, to }]);
      setFrom("");
      setTo("");
    }
  };

  const removeInterval = (index: number) => {
    setInterval(oldArray => [...oldArray.filter((oa, i) => i !== index)]);
  };

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      logger.debug("Submitting form AddCouponComp");
      localAddCouponForm.couponIntervals = interval;

      submitCallback(localAddCouponForm);
      setFormSubmitAttempts(0);
      event.preventDefault();
    },
    [interval]
  );

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <VStack align="center" justify="center">
          <FormControl
            isInvalid={
              formSubmitAttempts > 0 && cars.every(cn => localAddCouponForm.carId !== cn.id)
            }
            isRequired>
            <FormLabel>Select car id:</FormLabel>
            <Select
              placeholder="Select car"
              onChange={e => updateLocalForm(e.target.value, "carId")}>
              {cars.map(path => (
                <option key={path.id} value={path.id}>
                  {path.name}
                </option>
              ))}
            </Select>
            <FormErrorMessage>Please select a car</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={formSubmitAttempts > 0} isRequired={interval?.length < 1}>
            <FormLabel>Enter coupon interval:</FormLabel>
            <HStack>
              <Input
                type="number"
                placeholder="From"
                value={from}
                onChange={event => {
                  setFrom(event.target.value);
                }}
              />
              <Input
                type="number"
                placeholder="To"
                value={to}
                onChange={event => {
                  setTo(event.target.value);
                }}
              />
            </HStack>
            <Button
              mt={4}
              colorScheme="blue"
              rightIcon={<MdAdd />}
              onClick={() => addInterval(from, to)}>
              Add interval
            </Button>
            <FormErrorMessage>Please enter interval</FormErrorMessage>
          </FormControl>

          <FormControl>
            <FormLabel>Selected intervals:</FormLabel>
            <Wrap>
              {interval?.map((cn, index) => (
                <WrapItem key={index}>
                  <Tag size="md" borderRadius="full" variant="solid" colorScheme="blue">
                    <TagLabel>
                      {cn.from} - {cn.to}
                    </TagLabel>
                    <TagCloseButton onClick={() => removeInterval(index)} />
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>
          </FormControl>

          <Button
            colorScheme="green"
            type="submit"
            rightIcon={<MdCheck />}
            onClick={() => setFormSubmitAttempts(x => x + 1)}>
            Submit
          </Button>
        </VStack>
      </form>
    </Container>
  );
};

export default AddCouponComp;
