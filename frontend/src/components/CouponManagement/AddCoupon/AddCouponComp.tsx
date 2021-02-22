import "ts-array-ext/sortByAttr";

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
import { useI18n } from "next-rosetta";
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
  const { t } = useI18n<Locale>();

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
        .map(c => c.couponNumber);

      if (couponNumbers.length > 0) {
        submitCallback(couponNumbers);
        setFormSubmitAttempts(0);
      }
      event.preventDefault();
    },
    [localCoupons]
  );

  return (
    <form onSubmit={handleSubmit}>
      <VStack align="center" justify="center">
        <FormControl
          isInvalid={
            (formSubmitAttempts > 0 && (!localCoupons || localCoupons.length < 1)) ||
            from > to ||
            to < from
          }>
          <FormLabel>{t("addCoupon.enterCouponInterval")}</FormLabel>
          <HStack>
            <FormControl
              isInvalid={
                (formSubmitAttempts > 0 && (!localCoupons || localCoupons.length < 1)) || from > to
              }
              isRequired={!localCoupons || localCoupons.length < 1}>
              <NumberInput
                onChange={e => {
                  const value = parseFloat(e);
                  if (isNaN(value)) {
                    setFrom("");
                  } else {
                    setFrom(value);
                  }
                }}
                value={from ?? ""}>
                <NumberInputField />
              </NumberInput>
            </FormControl>
            <FormControl
              isInvalid={
                (formSubmitAttempts > 0 && (!localCoupons || localCoupons.length < 1)) || to < from
              }
              isRequired={!localCoupons || localCoupons.length < 1}>
              <NumberInput
                onChange={e => {
                  const value = parseFloat(e);
                  if (isNaN(value)) {
                    setTo("");
                  } else {
                    setTo(value);
                  }
                }}
                value={to ?? ""}>
                <NumberInputField />
              </NumberInput>
            </FormControl>
          </HStack>
          <FormErrorMessage>{t("addCoupon.formErrors.validInterval")}</FormErrorMessage>
          <Button mt={4} colorScheme="blue" rightIcon={<MdAdd />} onClick={() => addCoupons()}>
            {t("addCoupon.addPendingCoupons")}
          </Button>
        </FormControl>

        <FormControl>
          <FormLabel>{t("addCoupon.availableCoupons")}</FormLabel>
          <Wrap>
            {localCoupons
              .sortByAttr(x => x.couponNumber)
              .map((c, index) => (
                <WrapItem key={index}>
                  <Tag
                    size="md"
                    borderRadius="full"
                    variant="solid"
                    colorScheme={(c as CouponIdDto).id ? "blue" : "yellow"}>
                    <TagLabel>{c.couponNumber}</TagLabel>
                    {(c as CouponIdDto).id == undefined && (
                      <TagCloseButton onClick={() => removeCoupon(c.couponNumber)} />
                    )}
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
          {t("addCoupon.submitCoupons")}
        </Button>
      </VStack>
    </form>
  );
};

export default AddCouponComp;
