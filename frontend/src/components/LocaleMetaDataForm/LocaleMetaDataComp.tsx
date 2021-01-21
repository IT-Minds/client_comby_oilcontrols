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
  const [address, setAddress] = useState(null);
  const [city, setCity] = useState(null);
  const [comment, setComment] = useState(null);
  //TODO: Not actually used yet.
  const [dailyEstFuelConsumption, setDailyEstFuelConsumption] = useState(null);
  const [locationId, setLocationId] = useState(null);
  const [tankType, setTankType] = useState(null);
  const [tankNumber, setTankNumber] = useState(null);
  const [minFuelAmount, setMinFuelAmount] = useState(null);
  const [refillSchedule, setRefillSchedule] = useState(null);
  const [tankcapacity, setTankcapacity] = useState(null);
  const [formSubmitAttempts, setFormSubmitAttempts] = useState(0);

  const updateLocalForm = useCallback(
    (value: unknown, key: keyof IUpdateLocationMetaDataCommand) => {
      // setLocalReportForm(form => {
      //   (form[key] as unknown) = value;
      //   return form;
      // });
    },
    []
  );

  const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    logger.debug("Submitting form ReportingComp");
    submitCallback(null); // TODO
    setFormSubmitAttempts(0);
  }, []);

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <VStack spacing={2}>
          <FormControl>
            <FormLabel>Location ID: </FormLabel>
            <NumberInput
              placeholder="Location Id"
              onChange={value => {
                setLocationId(parseInt(value));
              }}
              value={locationId ?? ""}>
              <NumberInputField />
            </NumberInput>
          </FormControl>

          <FormControl>
            <Select placeholder="Location Type" onChange={e => setTankType(e.target.value)}>
              <option value={TankType.BUILDING}>Building</option>
              <option value={TankType.SHIP}>Ship</option>
              <option value={TankType.TANK}>Tank</option>
            </Select>
            <Input
              placeholder="Tank Number"
              onChange={e => {
                setTankNumber(parseInt(e.target.value));
              }}
              value={locationId ?? ""}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Address: </FormLabel>
            <Input
              placeholder="Address"
              onChange={e => {
                setAddress(e.target.value);
              }}
              value={address ?? ""}
            />

            <FormLabel>City/Zip code: </FormLabel>
            <Input
              placeholder="city/zip code"
              onChange={e => {
                setCity(e.target.value);
              }}
              value={city ?? ""}
            />
          </FormControl>

          <FormControl>
            <Select placeholder="Refill Schedule" onChange={e => setRefillSchedule(e.target.value)}>
              <option value={RefillSchedule.AUTOMAIC}>Automatic</option>
              <option value={RefillSchedule.INTERVAL}>Interval</option>
              <option value={RefillSchedule.MANUAL}>Manual</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Tank Capacity: </FormLabel>
            <NumberInput
              placeholder="Tank capacity."
              onChange={value => {
                setTankcapacity(parseInt(value));
              }}
              value={tankcapacity ?? ""}>
              <NumberInputField />
            </NumberInput>
          </FormControl>

          <FormControl>
            <FormLabel>Minimum Fuel Amount: </FormLabel>
            <NumberInput
              placeholder="Min. fuel amount"
              onChange={value => {
                setMinFuelAmount(parseInt(value));
              }}
              value={minFuelAmount ?? ""}>
              <NumberInputField />
            </NumberInput>
          </FormControl>

          <FormControl>
            <FormLabel>Daily Fuel Consumption Estimate: </FormLabel>
            <NumberInput
              placeholder="Est. fuel consumption"
              onChange={value => {
                setDailyEstFuelConsumption(parseInt(value));
              }}
              value={dailyEstFuelConsumption ?? ""}>
              <NumberInputField />
            </NumberInput>
          </FormControl>

          <FormControl>
            <VStack>
              <FormLabel>Comments</FormLabel>
              <Input
                placeholder="Comment"
                onChange={e => {
                  setComment(e.target.value);
                }}
                value={comment ?? ""}
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
            onClick={() => logger.debug("LocaleMetaDataFrom submit button.")}>
            Submit
          </Button>
        </VStack>
      </form>
    </Container>
  );
};

export default LocaleMetaDataComp;
