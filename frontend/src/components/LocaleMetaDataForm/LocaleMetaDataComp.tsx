import {
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightAddon,
  NumberInput,
  NumberInputField,
  Select,
  Spacer
} from "@chakra-ui/react";
import DatePicker from "components/DatePicker/DatePicker";
import DebtorSelector from "components/DebtorSelector/DebtorSelector";
import StreetSelector from "components/StreetSelector/StreetSelector";
import React, { FC, FormEvent, useCallback, useState } from "react";
import { MdCheck } from "react-icons/md";
import { FuelTypeRecord, RefillScheduleRecord } from "services/backend/ext/enumConvertor";
import {
  AddDebtorToLocationCommand,
  ILocationDetailsDto,
  LocationDebtorType,
  RefillSchedule,
  TankType
} from "services/backend/nswagts";
import { capitalize } from "utils/capitalizeAnyString";
import { logger } from "utils/logger";

type Props = {
  submitCallback: (
    reportForm: ILocationDetailsDto,
    debtors: AddDebtorToLocationCommand[],
    image?: File
  ) => void;
  localeMetaData?: ILocationDetailsDto;
};

const LocaleMetaDataComp: FC<Props> = ({ submitCallback, localeMetaData = null }) => {
  const [mainDebtorId, setMainDebtorId] = useState(null);
  const [baseDebtorId, setBaseDebtorId] = useState(null);
  const [upcomingDebtorId, setUpcomingDebtorId] = useState(null);
  const [debtorDate, setDebtorDate] = useState(new Date());
  const [image, setImage] = useState<File>(null);

  const [localForm, setLocalForm] = useState<ILocationDetailsDto>({
    address: "",
    comments: "",
    estimateFuelConsumption: 0,
    regionId: null,
    minimumFuelAmount: 0,
    schedule: -1,
    tankCapacity: 0,
    tankNumber: 0,
    tankType: -1,
    fuelType: -1,
    daysBetweenRefills: 0,
    ...localeMetaData
  });

  const [formSubmitAttempts, setFormSubmitAttempts] = useState(0);

  const updateLocalForm = useCallback((value: unknown, key: keyof typeof localForm) => {
    setLocalForm(form => {
      (form[key] as unknown) = value;
      return { ...form };
    });
  }, []);

  const saveImage = useCallback(async () => {
    const [handle] = await window.showOpenFilePicker();
    const file = await handle.getFile();
    setImage(file);
  }, []);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      logger.debug("Submitting form ReportingComp");
      const debtors: AddDebtorToLocationCommand[] = [];
      if (mainDebtorId) {
        debtors.push(
          new AddDebtorToLocationCommand({
            debtorId: mainDebtorId,
            debtorType: LocationDebtorType.MAIN
          })
        );
      }
      if (baseDebtorId) {
        debtors.push(
          new AddDebtorToLocationCommand({
            debtorId: baseDebtorId,
            debtorType: LocationDebtorType.BASE
          })
        );
      }
      if (upcomingDebtorId) {
        debtors.push(
          new AddDebtorToLocationCommand({
            debtorId: upcomingDebtorId,
            debtorType: LocationDebtorType.UPCOMING,
            changeDate: debtorDate
          })
        );
      }

      submitCallback(localForm, debtors, image);
      setFormSubmitAttempts(0);
    },
    [submitCallback, localForm, mainDebtorId, baseDebtorId, upcomingDebtorId, debtorDate, image]
  );

  return (
    <form onSubmit={handleSubmit}>
      <HStack alignItems="top">
        <Box>
          <Heading size="md" mb={4}>
            Location
          </Heading>
          <FormControl isRequired isInvalid={formSubmitAttempts > 0 && localForm.tankType <= -1}>
            {
              //TODO: translation
            }
            <FormLabel>Location Type:</FormLabel>
            <Select
              placeholder="Location Type"
              onChange={e => updateLocalForm(e.target.value, "tankType")}
              value={localForm.tankType}>
              {
                //TODO: translation
              }
              <option value={TankType.BUILDING}>Building</option>
              <option value={TankType.SHIP}>Ship</option>
              <option value={TankType.TANK}>Tank</option>
            </Select>
            {
              //TODO: translation
            }
            <FormErrorMessage>Please select a location type</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={formSubmitAttempts > 0 && !localForm.address}>
            {
              //TODO: translation
            }
            <FormLabel>Address:</FormLabel>

            <StreetSelector
              cb={x => {
                updateLocalForm(x.id, "address");
                updateLocalForm(x.regionId, "regionId" as keyof typeof localForm);
              }}
              value={localForm.address}
            />
            {
              //TODO: translation
            }
            <FormErrorMessage>Please enter an address</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={formSubmitAttempts > 0 && !localForm.schedule}>
            {
              //TODO: translation
            }
            <FormLabel>Refill Schedule:</FormLabel>
            <Select
              placeholder="Refill Schedule"
              onChange={e => updateLocalForm(e.target.value, "schedule")}
              value={localForm.schedule}>
              {
                //TODO: translation
              }
              {Object.entries(RefillScheduleRecord).map(([key, value]) => (
                <option key={key} value={value}>
                  {capitalize(key)}
                </option>
              ))}
            </Select>
            {
              //TODO: translation
            }
            <FormErrorMessage>Please select a refill schedule</FormErrorMessage>
          </FormControl>

          <FormControl
            isRequired={localForm.schedule == RefillSchedule.INTERVAL}
            isDisabled={localForm.schedule != RefillSchedule.INTERVAL}
            isInvalid={
              formSubmitAttempts > 0 &&
              localForm.schedule == RefillSchedule.INTERVAL &&
              !localForm.daysBetweenRefills
            }>
            {
              //TODO: translation
            }
            <FormLabel>Days between refills</FormLabel>
            <Input
              placeholder="# of days"
              type="number"
              onChange={e => {
                updateLocalForm(e.target.value, "daysBetweenRefills");
              }}
              value={localForm.daysBetweenRefills}
            />
            {
              //TODO: translation
            }
            <FormErrorMessage>Please enter a comment</FormErrorMessage>
          </FormControl>

          <FormControl>
            {
              //TODO: translation
            }
            <FormLabel>Comments</FormLabel>
            <Input
              placeholder="Comment"
              onChange={e => {
                updateLocalForm(e.target.value, "comments");
              }}
              value={localForm.comments}
            />
            {
              //TODO: translation
            }
            <FormErrorMessage>Please enter a comment</FormErrorMessage>
          </FormControl>

          <FormControl>
            {
              //TODO: translation
            }
            <FormLabel>Select an image of the tank location</FormLabel>
            <Button colorScheme="blue" onClick={saveImage}>
              {image ? "Re-select image" : "Select image"}
            </Button>
            {
              //TODO: translation
            }
            <FormErrorMessage>Please select an image</FormErrorMessage>
          </FormControl>
        </Box>
        <Spacer />
        <Box>
          <Heading size="md" mb={4}>
            Tank
          </Heading>
          <FormControl isRequired isInvalid={formSubmitAttempts > 0 && !localForm.tankNumber}>
            {
              //TODO: translation
            }
            <FormLabel>Tank Number:</FormLabel>
            <Input
              placeholder="Tank Number"
              onChange={e => {
                updateLocalForm(parseInt(e.target.value), "tankNumber");
              }}
              value={localForm.tankNumber}
            />
            {
              //TODO: translation
            }
            <FormErrorMessage>Please enter a tank number</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={formSubmitAttempts > 0 && !localForm.tankCapacity}>
            {
              //TODO: translation
            }
            <FormLabel>Tank Capacity:</FormLabel>
            <InputGroup>
              <NumberInput
                placeholder="Tank capacity"
                onChange={value => {
                  updateLocalForm(parseInt(value), "tankCapacity");
                }}
                value={localForm.tankCapacity}>
                <NumberInputField />
              </NumberInput>
              <InputRightAddon>liters</InputRightAddon>
            </InputGroup>
            {
              //TODO: translation
            }
            <FormErrorMessage>Please enter the capacity of the tank</FormErrorMessage>
          </FormControl>

          <FormControl
            isRequired
            isInvalid={formSubmitAttempts > 0 && !localForm.minimumFuelAmount}>
            {
              //TODO: translation
            }
            <FormLabel>Minimum Fuel Amount: </FormLabel>
            <InputGroup>
              <NumberInput
                placeholder="Min. fuel amount"
                onChange={value => {
                  updateLocalForm(parseInt(value), "minimumFuelAmount");
                }}
                value={localForm.minimumFuelAmount}>
                <NumberInputField />
              </NumberInput>
              <InputRightAddon>liters</InputRightAddon>
            </InputGroup>
            {
              //TODO: translation
            }
            <FormErrorMessage>Please enter the minimum fuel amount</FormErrorMessage>
          </FormControl>

          <FormControl
            isRequired
            isInvalid={formSubmitAttempts > 0 && !localForm.estimateFuelConsumption}>
            {
              //TODO: translation
            }
            <FormLabel>Daily Fuel Consumption Estimate: </FormLabel>
            <InputGroup>
              <NumberInput
                placeholder="Est. fuel consumption"
                onChange={value => {
                  updateLocalForm(parseInt(value), "estimateFuelConsumption");
                }}
                value={localForm.estimateFuelConsumption}>
                <NumberInputField />
              </NumberInput>
              <InputRightAddon>liters</InputRightAddon>
            </InputGroup>
            {
              //TODO: translation
            }
            <FormErrorMessage>Please enter the estimated fuel consumption</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={formSubmitAttempts > 0 && localForm.fuelType <= -1} isRequired>
            <FormLabel id="fuel-type">Select fuel type:</FormLabel>
            <Select
              onChange={e => updateLocalForm(e.target.value, "fuelType")}
              value={localForm.fuelType}
              placeholder="Select option">
              {Object.entries(FuelTypeRecord).map(([a, b]) => (
                <option key={b} value={b}>
                  {capitalize(a)}
                </option>
              ))}
            </Select>
            <FormErrorMessage>Please select one of the allowed fuel types</FormErrorMessage>
          </FormControl>
        </Box>
        <Spacer />
        <Box>
          <Heading size="md" mb={4}>
            Debtor
          </Heading>
          {
            //TODO: translation
          }
          <FormControl
            isInvalid={
              formSubmitAttempts > 0 && !mainDebtorId && !baseDebtorId && !upcomingDebtorId
            }>
            <FormLabel>Main</FormLabel>
            <DebtorSelector cb={x => setMainDebtorId(x?.dbId)} />

            <FormLabel>Base</FormLabel>
            <DebtorSelector cb={x => setBaseDebtorId(x?.dbId)} />
            <FormLabel>Upcoming</FormLabel>
            <DebtorSelector cb={x => setUpcomingDebtorId(x?.dbId)} />
            <FormLabel>Select date:</FormLabel>
            <DatePicker
              selectedDate={debtorDate}
              onChange={(date: Date) => setDebtorDate(date)}
              // value={localForm.fuelType}
              showPopperArrow={false}
            />
            <FormErrorMessage>Please add at least one Debtor ID</FormErrorMessage>
          </FormControl>
        </Box>
      </HStack>
      <Center mt={25}>
        {
          //TODO: translation
        }
        <Button
          colorScheme="green"
          type="submit"
          rightIcon={<MdCheck />}
          onClick={() => setFormSubmitAttempts(x => x + 1)}>
          Submit
        </Button>
      </Center>
    </form>
  );
};

export default LocaleMetaDataComp;
