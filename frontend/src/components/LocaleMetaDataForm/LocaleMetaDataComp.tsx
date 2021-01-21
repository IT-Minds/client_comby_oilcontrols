import {
  Button,
  Container,
  FormControl,
  FormLabel,
  HStack,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  StackDivider,
  VStack
} from "@chakra-ui/react";
import React, { FC, FormEvent, useCallback, useState } from "react";
import { MdCheck } from "react-icons/md";
import { IUpdateLocationMetaDataCommand, RefillSchedule, TankType } from "services/backend/nswagts";
import { logger } from "utils/logger";

type Props = {
  submitCallback: (reportForm: IUpdateLocationMetaDataCommand) => void;
};

const LocaleMetaDataComp: FC<Props> = ({ submitCallback }) => {
  const [localForm, setLocalForm] = useState<IUpdateLocationMetaDataCommand>({
    address: "",
    comment: "",
    estimateConsumption: null,
    locationId: null,
    minimumFuelAmount: null,
    refillschedule: null,
    tankCapacity: null,
    tankNumber: null,
    tankType: null
  });

  const [address, setAddress] = useState(null);
  const [city, setCity] = useState(null);
  const [formSubmitAttempts, setFormSubmitAttempts] = useState(0);

  const updateLocalForm = useCallback(
    (value: unknown, key: keyof IUpdateLocationMetaDataCommand) => {
      setLocalForm(form => {
        (form[key] as unknown) = value;
        return form;
      });
    },
    []
  );

  const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    logger.debug("Submitting form ReportingComp");
    localForm.address = address + city;
    submitCallback(localForm);
    setFormSubmitAttempts(0);
  }, []);

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <VStack spacing={2}>
          <FormControl isRequired isInvalid={formSubmitAttempts > 0 && !localForm.locationId}>
            <FormLabel>Location ID:</FormLabel>
            <NumberInput
              placeholder="Location Id"
              onChange={value => {
                updateLocalForm(parseInt(value), "locationId");
              }}>
              <NumberInputField />
            </NumberInput>
          </FormControl>

          <FormControl isRequired isInvalid={formSubmitAttempts > 0 && !localForm.tankType}>
            <FormLabel>Location Type:</FormLabel>
            <Select
              placeholder="Location Type"
              onChange={e => updateLocalForm(e.target.value, "tankType")}>
              <option value={TankType.BUILDING}>Building</option>
              <option value={TankType.SHIP}>Ship</option>
              <option value={TankType.TANK}>Tank</option>
            </Select>
          </FormControl>

          <FormControl isRequired isInvalid={formSubmitAttempts > 0 && !localForm.tankNumber}>
            <FormLabel>Tank Number:</FormLabel>
            <Input
              placeholder="Tank Number"
              onChange={e => {
                updateLocalForm(parseInt(e.target.value), "tankNumber");
              }}
            />
          </FormControl>

          <FormControl isRequired isInvalid={formSubmitAttempts > 0 && !address}>
            <FormLabel>Address:</FormLabel>
            <Input
              placeholder="Address"
              onChange={e => {
                setAddress(e.target.value);
              }}
            />
          </FormControl>

          <FormControl isRequired isInvalid={formSubmitAttempts > 0 && !city}>
            <FormLabel>City/Zip code:</FormLabel>
            <Input
              placeholder="City/zip code"
              onChange={e => {
                setCity(e.target.value);
              }}
              value={city ?? ""}
            />
          </FormControl>

          <FormControl isRequired isInvalid={formSubmitAttempts > 0 && !localForm.refillschedule}>
            <FormLabel>Refill Schedule:</FormLabel>
            <Select
              placeholder="Refill Schedule"
              onChange={e => updateLocalForm(e.target.value, "refillschedule")}>
              <option value={RefillSchedule.AUTOMAIC}>Automatic</option>
              <option value={RefillSchedule.INTERVAL}>Interval</option>
              <option value={RefillSchedule.MANUAL}>Manual</option>
            </Select>
          </FormControl>

          <FormControl isRequired isInvalid={formSubmitAttempts > 0 && !localForm.tankCapacity}>
            <FormLabel>Tank Capacity:</FormLabel>
            <NumberInput
              placeholder="Tank capacity."
              onChange={value => {
                updateLocalForm(parseInt(value), "tankCapacity");
              }}>
              <NumberInputField />
            </NumberInput>
          </FormControl>

          <FormControl
            isRequired
            isInvalid={formSubmitAttempts > 0 && !localForm.minimumFuelAmount}>
            <FormLabel>Minimum Fuel Amount: </FormLabel>
            <NumberInput
              placeholder="Min. fuel amount"
              onChange={value => {
                updateLocalForm(parseInt(value), "minimumFuelAmount");
              }}>
              <NumberInputField />
            </NumberInput>
          </FormControl>

          <FormControl
            isRequired
            isInvalid={formSubmitAttempts > 0 && !localForm.estimateConsumption}>
            <FormLabel>Daily Fuel Consumption Estimate: </FormLabel>
            <NumberInput
              placeholder="Est. fuel consumption"
              onChange={value => {
                updateLocalForm(parseInt(value), "estimateConsumption");
              }}>
              <NumberInputField />
            </NumberInput>
          </FormControl>

          <FormControl isRequired isInvalid={formSubmitAttempts > 0 && !localForm.comment}>
            <VStack>
              <FormLabel>Comments</FormLabel>
              <Input
                placeholder="Comment"
                onChange={e => {
                  updateLocalForm(e.target.value, "comment");
                }}
              />
            </VStack>
          </FormControl>

          <FormControl>
            <VStack>
              <FormLabel>Images</FormLabel>
              {
                //TODO: Should be an upload input type.
              }
              <Input></Input>
            </VStack>
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

export default LocaleMetaDataComp;
