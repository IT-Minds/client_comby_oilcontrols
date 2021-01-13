import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Select,
  Tag,
  TagCloseButton,
  TagLabel,
  VStack
} from "@chakra-ui/react";
import React, { FC, FormEvent, useCallback, useState } from "react";
import { MdCheck } from "react-icons/md";
import DropdownType from "types/DropdownType";
import { logger } from "utils/logger";

import { AddCouponForm } from "./AddCouponForm";

type Props = {
  submitCallback: (addCouponForm: AddCouponForm) => void;
  cars: DropdownType[];
  couponNumbers?: DropdownType[];
};

const AddCouponComp: FC<Props> = ({ submitCallback, cars = [], couponNumbers = [] }) => {
  const [localAddCouponForm, setLocalAddCouponForm] = useState<AddCouponForm>({
    carId: "1",
    couponIds: []
  });

  const [formSubmitAttempts, setFormSubmitAttempts] = useState(0);

  const updateLocalForm = useCallback((value: unknown, key: keyof AddCouponForm) => {
    setLocalAddCouponForm(form => {
      (form[key] as unknown) = value;
      return form;
    });
  }, []);

  const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    logger.debug("Submitting form AddCouponComp");
    submitCallback(localAddCouponForm);
    setFormSubmitAttempts(0);
    event.preventDefault();
  }, []);

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
              formSubmitAttempts > 0 &&
              couponNumbers.every(cn => localAddCouponForm.carId !== cn.id)
            }
            isRequired>
            <FormLabel>Select coupon number:</FormLabel>
            <Select
              placeholder="Select coupon(s)"
              onChange={e => updateLocalForm(e.target.value, "couponIds")}>
              {couponNumbers.map(path => (
                <option key={path.id} value={path.id}>
                  {path.name}
                </option>
              ))}
            </Select>
            <FormErrorMessage>Please select one of the allowed coupons</FormErrorMessage>
          </FormControl>

          <HStack spacing={4}>
            {localAddCouponForm.couponIds.map(cn => (
              <Tag size="md" key={cn} borderRadius="full" variant="solid" colorScheme="green">
                <TagLabel>{cn}</TagLabel>
                <TagCloseButton />
              </Tag>
            ))}
          </HStack>

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
