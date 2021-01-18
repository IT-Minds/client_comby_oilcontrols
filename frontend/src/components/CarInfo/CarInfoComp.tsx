import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  NumberInput,
  NumberInputField,
  Select,
  Text,
  VStack
} from "@chakra-ui/react";
import React, { FC, FormEvent, useCallback, useState } from "react";
import { MdAdd, MdCheck, MdDelete } from "react-icons/md";
import { logger } from "utils/logger";

import { CarInfoForm } from "./CarInfoForm";
import FillingComp from "./Filling/FillingComp";
import { FillingForm } from "./Filling/FillingForm";

type Props = {
  submitCallback: (carInfoForm: CarInfoForm) => void;
  car: string;
};

const CarInfoComp: FC<Props> = ({ submitCallback, car }) => {
  const [localCarInfoForm, setLocalCarInfoForm] = useState<CarInfoForm>({
    carId: "",
    amountFilled: null,
    cardNumber: "",
    date: 0,
    evening: null,
    headCount: null,
    morning: null,
    fuelType: null,
    fillings: []
  });

  const [isAddFilling, setIsAddFilling] = useState(false);
  const [formSubmitAttempts, setFormSubmitAttempts] = useState(0);

  const [fillings, setFillings] = useState<FillingForm[]>([]);

  const addFilling = useCallback(
    (data: FillingForm) => {
      fillings.push(data);
    },
    [fillings]
  );

  const removeFilling = useCallback((date: number) => {
    setFillings(oldArray => oldArray.filter(oa => oa.date !== date));
  }, []);

  const updateLocalForm = useCallback((value: unknown, key: keyof CarInfoForm) => {
    setLocalCarInfoForm(form => {
      (form[key] as unknown) = value;
      return form;
    });
  }, []);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      logger.debug("Submitting form CarInfoComp");

      localCarInfoForm.fillings = fillings;
      localCarInfoForm.date = Date.now();
      submitCallback(localCarInfoForm);
      setFormSubmitAttempts(0);
      console.log(localCarInfoForm);

      event.preventDefault();
    },
    [localCarInfoForm, fillings]
  );

  return (
    <Container>
      {isAddFilling && (
        <FillingComp
          fillData={data => {
            addFilling(data);
            setIsAddFilling(false);
          }}
        />
      )}
      <form onSubmit={handleSubmit} hidden={isAddFilling}>
        <VStack align="center" justify="center">
          <Heading as="h4" size="md">
            Information of car {car}
          </Heading>
          <FormControl
            isInvalid={
              formSubmitAttempts > 0 && (!localCarInfoForm.morning || !localCarInfoForm.evening)
            }
            isRequired>
            <FormLabel>Morning and evening:</FormLabel>
            <HStack>
              <FormControl
                isInvalid={formSubmitAttempts > 0 && !localCarInfoForm.morning}
                isRequired>
                <NumberInput
                  placeholder="Morning"
                  onChange={value => updateLocalForm(value, "morning")}>
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl
                isInvalid={formSubmitAttempts > 0 && !localCarInfoForm.evening}
                isRequired>
                <NumberInput
                  placeholder="Evening"
                  onChange={value => updateLocalForm(value, "evening")}>
                  <NumberInputField />
                </NumberInput>
              </FormControl>
            </HStack>
            <FormErrorMessage>Please enter values</FormErrorMessage>
          </FormControl>
          <Button colorScheme="blue" rightIcon={<MdAdd />} onClick={() => setIsAddFilling(true)}>
            Add filling
          </Button>
          <FormControl hidden={fillings.length < 1}>
            <FormLabel>Filling data:</FormLabel>
            {fillings.map(fill => (
              <HStack key={fill.date}>
                <Text key={fill.date}>
                  Filled: {fill.fillAmount}, Card number: {fill.cardNumber}, Date:{" "}
                  {new Date(fill.date).toDateString()}{" "}
                </Text>
                <MdDelete onClick={() => removeFilling(fill.date)} />
              </HStack>
            ))}
          </FormControl>
          <FormControl isInvalid={formSubmitAttempts > 0 && !localCarInfoForm.fuelType} isRequired>
            <FormLabel>Fuel type:</FormLabel>
            <Select
              placeholder="Select fuel type"
              onChange={e => updateLocalForm(e.target.value, "fuelType")}>
              <option>Oil</option>
              <option>Petroleum</option>
              <option>Gasoline</option>
              <option>Other</option>
              {/* {cars.map(car => (
                <option key={car.id} value={car.id}>
                  {car.name}
                </option> */}
            </Select>
            <FormErrorMessage>Please select a fuel type</FormErrorMessage>
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

export default CarInfoComp;
