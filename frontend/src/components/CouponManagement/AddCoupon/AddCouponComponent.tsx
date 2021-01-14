import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  NumberInput,
  NumberInputField,
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
import { mergeArrayRanges } from "utils/mergeArrayRanges";

import { AddCouponForm } from "./AddCouponForm";

type Props = {
  submitCallback: (addCouponForm: AddCouponForm) => void;
  cars: DropdownType[];
};

const AddCouponComp: FC<Props> = ({ submitCallback, cars = [] }) => {
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
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

  const addInterval = useCallback(() => {
    if (from > 0 && to > 0) {
      const mergedArr = mergeArrayRanges(interval, {
        start: from,
        end: to,
        id: Date.now().toString(16)
      });

      setInterval(mergedArr);

      setFrom(null);
      setTo(null);
    }
  }, [from, to, interval]);

  const removeInterval = useCallback(
    (id: string) => {
      setInterval(oldArray => oldArray.filter(oa => oa.id !== id));
    },
    [interval]
  );

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      logger.debug("Submitting form AddCouponComp");
      localAddCouponForm.couponIntervals = interval;

      submitCallback(localAddCouponForm);
      setFormSubmitAttempts(0);
      event.preventDefault();
    },
    [interval, localAddCouponForm]
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

          <FormControl
            isInvalid={
              (formSubmitAttempts > 0 && (!interval || interval.length < 1)) ||
              from > to ||
              to < from
            }>
            <FormLabel>Enter coupon interval:</FormLabel>
            <HStack>
              <FormControl
                isInvalid={
                  (formSubmitAttempts > 0 && (!interval || interval.length < 1)) || from > to
                }
                isRequired={!interval || interval.length < 1}>
                <NumberInput
                  placeholder="From"
                  onChange={value => {
                    setFrom(parseFloat(value));
                  }}
                  value={from ?? ""}>
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl
                isInvalid={
                  (formSubmitAttempts > 0 && (!interval || interval.length < 1)) || to < from
                }
                isRequired={!interval || interval.length < 1}>
                <NumberInput
                  placeholder="To"
                  onChange={value => {
                    setTo(parseFloat(value));
                  }}
                  value={to ?? ""}>
                  <NumberInputField />
                </NumberInput>
              </FormControl>
            </HStack>
            <FormErrorMessage>Please enter a valid interval</FormErrorMessage>
            <Button mt={4} colorScheme="blue" rightIcon={<MdAdd />} onClick={() => addInterval()}>
              Add interval
            </Button>
          </FormControl>

          <FormControl>
            <FormLabel>Selected intervals:</FormLabel>
            <Wrap>
              {interval?.map(cn => (
                <WrapItem key={cn.id}>
                  <Tag size="md" borderRadius="full" variant="solid" colorScheme="blue">
                    <TagLabel>
                      {cn.start} - {cn.end}
                    </TagLabel>
                    <TagCloseButton onClick={() => removeInterval(cn.id)} />
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
