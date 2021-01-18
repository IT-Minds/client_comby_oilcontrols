import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField
} from "@chakra-ui/react";
import React, { FC, useCallback, useState } from "react";
import { MdAdd } from "react-icons/md";

import { FillingForm } from "./FillingForm";

type Props = {
  fillData: (addCouponForm: FillingForm) => void;
};

const FillingComp: FC<Props> = ({ fillData }) => {
  const [localFillingForm, setLocalFillingForm] = useState<FillingForm>({
    fillAmount: null,
    cardNumber: null,
    date: Date.now()
  });

  const updateLocalForm = useCallback((value: unknown, key: keyof FillingForm) => {
    setLocalFillingForm(form => {
      (form[key] as unknown) = value;
      return form;
    });
  }, []);

  const addFilling = useCallback(() => {
    fillData(localFillingForm);
  }, [localFillingForm]);

  const [formSubmitAttempts, setFormSubmitAttempts] = useState(0);

  return (
    <Container>
      <FormControl isInvalid={formSubmitAttempts > 0 && !localFillingForm.fillAmount} isRequired>
        <FormLabel>Filling amount (in liters):</FormLabel>
        <NumberInput
          placeholder="Fill amount"
          onChange={value => updateLocalForm(value, "fillAmount")}>
          <NumberInputField />
        </NumberInput>
        <FormErrorMessage>Please enter amount filled</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={formSubmitAttempts > 0 && !localFillingForm.cardNumber} isRequired>
        <FormLabel>Card number:</FormLabel>
        <NumberInput
          placeholder="Card number"
          onChange={value => updateLocalForm(value, "cardNumber")}>
          <NumberInputField />
        </NumberInput>
        <FormErrorMessage>Please enter card number</FormErrorMessage>
      </FormControl>
      <FormControl isReadOnly>
        <FormLabel>Date:</FormLabel>
        <Input value={localFillingForm.date.toString()} />
        <FormErrorMessage>Please enter card number</FormErrorMessage>
      </FormControl>

      <Button
        mt={4}
        colorScheme="blue"
        rightIcon={<MdAdd />}
        type="submit"
        onClick={() => {
          setFormSubmitAttempts(x => x + 1);
          addFilling();
        }}>
        Add filling
      </Button>
    </Container>
  );
};

export default FillingComp;
