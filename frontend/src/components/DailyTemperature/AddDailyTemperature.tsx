import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  VStack
} from "@chakra-ui/react";
import React, { FC, FormEvent, useCallback, useState } from "react";
import { MdCheck } from "react-icons/md";
import DropdownType from "types/DropdownType";
import { formatInputNumber, parseInputToNumber } from "utils/formatNumber";
import { logger } from "utils/logger";

import { AddDailyTemperatureForm } from "./AddDailyTemperatureForm";

type Props = {
  submitCallback: (addCouponForm: AddDailyTemperatureForm) => void;
  regions: DropdownType[];
};

const AddDailyTemperatureComp: FC<Props> = ({ submitCallback, regions: regions = [] }) => {
  const [
    localAddDailyTemperatureForm,
    setLocalAddDailyTemperatureForm
  ] = useState<AddDailyTemperatureForm>({
    date: null,
    regionId: "",
    temperature: null
  });

  const [formSubmitAttempts, setFormSubmitAttempts] = useState(0);

  const updateLocalForm = useCallback((value: unknown, key: keyof AddDailyTemperatureForm) => {
    setLocalAddDailyTemperatureForm(form => {
      (form[key] as unknown) = value;
      return form;
    });
  }, []);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      logger.debug("Submitting form AddDailyTemperatureComp");
      submitCallback(localAddDailyTemperatureForm);
      setFormSubmitAttempts(0);
      event.preventDefault();
    },
    [localAddDailyTemperatureForm]
  );

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <VStack align="center" justify="center">
          <FormControl
            isInvalid={
              formSubmitAttempts > 0 &&
              regions.every(r => localAddDailyTemperatureForm.regionId !== r.id)
            }
            isRequired>
            <FormLabel>Select region:</FormLabel>
            <Select
              placeholder="Select region"
              onChange={e => updateLocalForm(e.target.value, "regionId")}>
              {regions.map(car => (
                <option key={car.id} value={car.id}>
                  {car.name}
                </option>
              ))}
            </Select>
            <FormErrorMessage>Please select a region</FormErrorMessage>
          </FormControl>

          <FormControl>Insert date-picker here</FormControl>

          <FormControl isRequired>
            <NumberInput
              defaultValue={0}
              placeholder="From"
              onChange={value => {
                updateLocalForm(parseInputToNumber(formatInputNumber(value)), "temperature");
              }}>
              <NumberInputField />
            </NumberInput>

            {/* <Input
              placeholder="Degrees"
              type="number"
              onChange={e =>
                updateLocalForm(
                  parseInputToNumber(formatInputNumber(e.target.value)),
                  "temperature"
                )
              }></Input> */}
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

export default AddDailyTemperatureComp;
