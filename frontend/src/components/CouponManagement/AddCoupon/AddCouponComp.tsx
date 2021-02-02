import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  NumberInput,
  NumberInputField,
  Tag,
  TagCloseButton,
  TagLabel,
  VStack,
  Wrap,
  WrapItem
} from "@chakra-ui/react";
import React, { FC, FormEvent, useCallback, useEffect, useReducer, useState } from "react";
import { MdAdd, MdCheck } from "react-icons/md";
import ListReduce, { ListReducerActionType } from "react-list-reducer";
import { CouponDto, CouponIdDto, CouponStatus } from "services/backend/nswagts";
import { logger } from "utils/logger";

type Props = {
  submitCallback: (couponNumbers: number[]) => void;
  coupons: CouponIdDto[];
};

const AddCouponComp: FC<Props> = ({ submitCallback, coupons }) => {
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);

  const [localCoupons, dispatchLocalCoupons] = useReducer(
    ListReduce<CouponIdDto | CouponDto>("couponNumber"),
    coupons ?? []
  );

  useEffect(() => {
    if (coupons) {
      dispatchLocalCoupons({
        type: ListReducerActionType.Reset,
        data: coupons
      });
    }
  }, [coupons]);

  const [formSubmitAttempts, setFormSubmitAttempts] = useState(0);

  const addCoupons = useCallback(() => {
    if (from > 0 && to > 0) {
      const length = to - from + 1;

      const newArr = [...new Array(length)]
        .map((_, i) => i + from)
        .filter(couponNumber => !coupons.some(c => c.couponNumber === couponNumber))
        .filter(couponNumber => !localCoupons.some(c => c.couponNumber === couponNumber))
        .map(couponNumber => {
          if (
            !coupons.some(c => c.couponNumber === couponNumber) &&
            !localCoupons.some(c => c.couponNumber === couponNumber)
          ) {
            return new CouponDto({
              couponNumber: couponNumber,
              status: CouponStatus.AVAILABLE,
              truckId: null //Null as it is not relevant in this component
            });
          }
        });

      dispatchLocalCoupons({
        type: ListReducerActionType.Add,
        data: newArr
      });

      setFrom(null);
      setTo(null);
    }
  }, [from, to, coupons]);

  const removeCoupon = useCallback((couponNumber: number) => {
    dispatchLocalCoupons({
      type: ListReducerActionType.Remove,
      data: couponNumber
    });
  }, []);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      logger.debug("Submitting form AddCouponComp");
      const couponNumbers = localCoupons
        .filter(c => !(c as CouponIdDto).id)
        .map(c => {
          return c.couponNumber;
        });

      if (couponNumbers.length > 0) {
        submitCallback(couponNumbers);
        setFormSubmitAttempts(0);
      }
      event.preventDefault();
    },
    [localCoupons]
  );

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <VStack align="center" justify="center">
          <FormControl
            isInvalid={
              (formSubmitAttempts > 0 && (!localCoupons || localCoupons.length < 1)) ||
              from > to ||
              to < from
            }>
            <FormLabel>Enter coupon interval:</FormLabel>
            <HStack>
              <FormControl
                isInvalid={
                  (formSubmitAttempts > 0 && (!localCoupons || localCoupons.length < 1)) ||
                  from > to
                }
                isRequired={!localCoupons || localCoupons.length < 1}>
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
                  (formSubmitAttempts > 0 && (!localCoupons || localCoupons.length < 1)) ||
                  to < from
                }
                isRequired={!localCoupons || localCoupons.length < 1}>
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
            <Button mt={4} colorScheme="blue" rightIcon={<MdAdd />} onClick={() => addCoupons()}>
              Add interval
            </Button>
          </FormControl>

          <FormControl>
            <FormLabel>Selected intervals:</FormLabel>
            <Wrap>
              {localCoupons?.map((c, index) => (
                <WrapItem key={index}>
                  {(c as CouponIdDto).id ? (
                    <Tag size="md" borderRadius="full" variant="solid" colorScheme="blue">
                      <TagLabel>{c.couponNumber}</TagLabel>
                    </Tag>
                  ) : (
                    <Tag size="md" borderRadius="full" variant="solid" colorScheme="yellow">
                      <TagLabel>{c.couponNumber}</TagLabel>
                      <TagCloseButton onClick={() => removeCoupon(c.couponNumber)} />
                    </Tag>
                  )}
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
