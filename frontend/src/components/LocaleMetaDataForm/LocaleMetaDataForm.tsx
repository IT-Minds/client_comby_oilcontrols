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
import { logger } from "utils/logger";

type Props = {
  id: string;
};

const LocaleMetaDataForm: FC<Props> = ({ id }) => {
  const [locationId, setLocationId] = useState(null);
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
                <option value="option1">Building</option>
                <option value="option2">Ship</option>
                <option value="option3">Tank</option>
              </Select>
              {
                //TODO:FIX THIS SO THE CORRECT PLACEHOLDER IS SHOWN.
              }
              <NumberInput
                placholder="Location Id"
                onChange={value => {
                  setLocationId(parseInt(value));
                }}
                value={locationId ?? ""}>
                <NumberInputField />
              </NumberInput>
            </HStack>
          </FormControl>

          <FormControl>
            <HStack>
              <FormLabel>Address: </FormLabel>
              <Input></Input>
            </HStack>
            <HStack>
              <FormLabel>City/Zip code: </FormLabel>
              <Input></Input>
            </HStack>
          </FormControl>

          <FormControl>
            <HStack>
              <FormLabel>Refill Type: </FormLabel>
              <Input></Input>
            </HStack>

            <HStack>
              <FormLabel>Tank Capacity: </FormLabel>
              <Input></Input>
            </HStack>

            <HStack>
              <FormLabel>Tank Minimum Amount: </FormLabel>
              <Input></Input>
            </HStack>

            <HStack>
              <FormLabel>Daily Fuel Consumption Estimate: </FormLabel>
              <Input></Input>
            </HStack>
          </FormControl>

          <FormControl>
            <VStack>
              <FormLabel>Comments</FormLabel>
              <Input></Input>
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
