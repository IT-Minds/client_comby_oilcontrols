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
import React, { FC, FormEvent, useCallback, useEffect, useState } from "react";
import { MdAdd, MdCheck } from "react-icons/md";
import { CouponDto } from "services/backend/nswagts";
import { CouponInterval } from "types/CouponInterval";
import DropdownType from "types/DropdownType";
import { logger } from "utils/logger";
import { mergeArrayRanges } from "utils/mergeArrayRanges";

import { AddCouponForm } from "./AddCouponForm";

type Props = {
  submitCallback: (addCouponForm: AddCouponForm) => void;
  coupons: CouponDto[];
};

const AddCouponComp: FC<Props> = ({ submitCallback, coupons }) => {
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [interval, setInterval] = useState<CouponInterval[]>([]);
  const [localCoupons, setLocalCoupons] = useState<CouponDto[]>([]);

  const [localAddCouponForm, setLocalAddCouponForm] = useState<AddCouponForm>({
    carId: "",
    couponIntervals: []
  });

  useEffect(() => {
    if (coupons) {
      //setLocalTruckMetaDataForm(truckMetaData);
      setLocalCoupons(coupons);
    }
  }, [coupons]);

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

  const removeInterval = useCallback((id: string) => {
    setInterval(oldArray => oldArray.filter(oa => oa.id !== id));
  }, []);

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
              {coupons?.map((c, index) => (
                <WrapItem key={index}>
                  <Tag size="md" borderRadius="full" variant="solid" colorScheme="blue">
                    <TagLabel>{c.couponNumber}</TagLabel>
                    {/* <TagCloseButton onClick={() => removeInterval(c.id)} /> */}
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>
            <Wrap>
              {interval?.map(cn => (
                <WrapItem key={cn.id}>
                  <Tag size="md" borderRadius="full" variant="solid" colorScheme="yellow">
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
