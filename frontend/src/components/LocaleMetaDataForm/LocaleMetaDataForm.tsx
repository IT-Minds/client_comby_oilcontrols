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
import { MdCheck, MdLocationCity } from "react-icons/md";
import { logger } from "utils/logger";

type Props = {
  id: string;
};

const LocaleMetaDataForm: FC<Props> = ({ id }) => {
  const [locationId, setLocationId] = useState(null);
  const [address, setAddress] = useState(null);
  const [city, setCity] = useState(null);
  const [tankcapacity, setTankcapacity] = useState(null);
  const [minFuelAmount, setMinFuelAmount] = useState(null);
  const [dailyEstFuelConsumption, setDailyEstFuelConsumption] = useState(null);
  const [comment, setComment] = useState(null);

  const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    logger.debug("Submitting form LocaleMetaDataForm");
    logger.debug(JSON.stringify(event));
  }, []);

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <VStack divider={<StackDivider borderColor="black" />}>
          <FormControl>
            {
              //TODO: Find a way to align a little better.
            }
            <HStack>
              {
                //TODO: Find correct values to insert here and where to read the actual type enum from.
              }
              <Select placeholder="Location Type">
                <option value="Building">Building</option>
                <option value="Ship">Ship</option>
                <option value="Tank">Tank</option>
              </Select>
              {
                //TODO:FIX THIS SO THE CORRECT PLACEHOLDER IS SHOWN.
              }
              <NumberInput
                placeholder="Location Id"
                onChange={value => {
                  setLocationId(parseInt(value));
                }}
                value={locationId ?? ""}>
                <NumberInputField />
              </NumberInput>
            </HStack>
            <HStack>
              <FormLabel>Address: </FormLabel>
              <Input
                placeholder="Address"
                onChange={e => {
                  setAddress(e.target.value);
                }}
                value={address ?? ""}
              />
            </HStack>
            <HStack>
              <FormLabel>City/Zip code: </FormLabel>
              <Input
                placeholder="city/zip code"
                onChange={e => {
                  setCity(e.target.value);
                }}
                value={city ?? ""}
              />
            </HStack>
          </FormControl>

          <FormControl>
            {
              //TODO: Find correct values to insert here and where to read the actual type enum from.
            }
            <Select placeholder="Refill Type">
              <option value="Automatic">Automatic</option>
              <option value="Interval">Interval</option>
              <option value="Manual">Manual</option>
            </Select>

            <HStack>
              <FormLabel>Tank Capacity: </FormLabel>
              <NumberInput
                placeholder="Tank capacity."
                onChange={value => {
                  setTankcapacity(parseInt(value));
                }}
                value={tankcapacity ?? ""}>
                <NumberInputField />
              </NumberInput>
            </HStack>

            <HStack>
              <FormLabel>Minimum Fuel Amount: </FormLabel>
              <NumberInput
                placeholder="Min. fuel amount"
                onChange={value => {
                  setMinFuelAmount(parseInt(value));
                }}
                value={minFuelAmount ?? ""}>
                <NumberInputField />
              </NumberInput>
            </HStack>

            <HStack>
              <FormLabel>Daily Fuel Consumption Estimate: </FormLabel>
              <NumberInput
                placeholder="Est. fuel consumption"
                onChange={value => {
                  setDailyEstFuelConsumption(parseInt(value));
                }}
                value={dailyEstFuelConsumption ?? ""}>
                <NumberInputField />
              </NumberInput>
            </HStack>
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

export default LocaleMetaDataForm;
