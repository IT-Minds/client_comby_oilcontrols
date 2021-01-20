import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Textarea,
  VStack
} from "@chakra-ui/react";
import React, { FC, FormEvent, useCallback, useState } from "react";
import { MdCheck } from "react-icons/md";
import { logger } from "utils/logger";

import { AddTruckMetaDataForm } from "./AddTruckMetaDataForm";

type Props = {
  submitCallback: (addTruckMetaDataForm: AddTruckMetaDataForm) => void;
  //truckMetaData: TYPE;
};

const AddTruckMetaData: FC<Props> = ({ submitCallback }) => {
  const [localAddTruckMetaDataForm, setlocalAddTruckMetaDataForm] = useState<AddTruckMetaDataForm>({
    carNumber: null,
    description: null,
    name: null,
    tankSize: null
  });

  const [formSubmitAttempts, setFormSubmitAttempts] = useState(0);

  const updateLocalForm = useCallback((value: unknown, key: keyof AddTruckMetaDataForm) => {
    setlocalAddTruckMetaDataForm(form => {
      (form[key] as unknown) = value;
      return form;
    });
  }, []);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      logger.debug("Submitting form AddTruckMetaDataForm");

      submitCallback(localAddTruckMetaDataForm);
      setFormSubmitAttempts(0);
      event.preventDefault();
    },
    [localAddTruckMetaDataForm]
  );

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <VStack align="center" justify="center">
          <FormControl
            isRequired
            isInvalid={formSubmitAttempts > 0 && !localAddTruckMetaDataForm.carNumber}>
            <FormLabel>Car number:</FormLabel>
            <NumberInput
              min={0}
              max={999}
              onChange={value => {
                updateLocalForm(value, "carNumber");
              }}>
              <NumberInputField />
            </NumberInput>
            <FormErrorMessage>Please enter a car number</FormErrorMessage>
          </FormControl>

          <FormControl
            isRequired
            isInvalid={formSubmitAttempts > 0 && !localAddTruckMetaDataForm.name}>
            <FormLabel>Car name:</FormLabel>
            <Input
              placeholder="Car name"
              onChange={e => {
                updateLocalForm(e.target.value, "name");
              }}></Input>
            <FormErrorMessage>Please specify a car name</FormErrorMessage>
          </FormControl>

          <FormControl
            isRequired
            isInvalid={formSubmitAttempts > 0 && !localAddTruckMetaDataForm.description}>
            <FormLabel>Description:</FormLabel>
            <Textarea
              placeholder="Description of car"
              onChange={e => {
                updateLocalForm(e.target.value, "description");
              }}></Textarea>
            <FormErrorMessage>Please specify a description of the car</FormErrorMessage>
          </FormControl>

          <FormControl
            isRequired
            isInvalid={formSubmitAttempts > 0 && !localAddTruckMetaDataForm.tankSize}>
            <FormLabel>Tank size:</FormLabel>
            <NumberInput
              min={0}
              onChange={value => {
                updateLocalForm(value, "tankSize");
              }}>
              <NumberInputField />
            </NumberInput>
            <FormErrorMessage>Please specify a tank size</FormErrorMessage>
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

export default AddTruckMetaData;
