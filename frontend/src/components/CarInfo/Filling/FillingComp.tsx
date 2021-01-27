import {
  Button,
  Center,
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
    if (localFillingForm.fillAmount && localFillingForm.cardNumber) {
      fillData(localFillingForm);
    }
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
        <Input value={new Date(localFillingForm.date).toDateString()} />
        <FormErrorMessage>Please enter card number</FormErrorMessage>
      </FormControl>

      <Center>
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
      </Center>
    </Container>
  );
};

export default FillingComp;
