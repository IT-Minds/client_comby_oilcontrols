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
import { useI18n } from "next-rosetta";
import React, { FC, FormEvent, useCallback, useState } from "react";
import { MdCheck } from "react-icons/md";
import {
  FuelTypeRecord,
  RefillScheduleRecord,
  TankTypeRecord
} from "services/backend/ext/enumConvertor";
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
  const { t } = useI18n<Locale>();

  const [mainDebtorId, setMainDebtorId] = useState(null);
  const [baseDebtorId, setBaseDebtorId] = useState(null);
  const [upcomingDebtorId, setUpcomingDebtorId] = useState(null);
  const [debtorDate, setDebtorDate] = useState(new Date());
  const [image, setImage] = useState<File>(null);

  const [localForm, setLocalForm] = useState<ILocationDetailsDto>({
    address: "",
    addressExtra: "",
    comments: "",
    estimateFuelConsumption: 0,
    regionId: null,
    minimumFuelAmount: 0,
    schedule: -1,
    tankCapacity: 0,
    tankNumber: "0",
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
            {t("localeMetaData.location")}
          </Heading>
          <FormControl isRequired isInvalid={formSubmitAttempts > 0 && localForm.tankType <= -1}>
            <FormLabel>{t("localeMetaData.locationType")}</FormLabel>
            <Select
              placeholder={t("localeMetaData.selectALocation") as string}
              onChange={e => updateLocalForm(e.target.value, "tankType")}
              value={localForm.tankType}>
              {Object.entries(TankTypeRecord).map(([a, b]) => (
                <option key={b} value={b}>
                  {t("enums.tankType." + b)}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{t("localeMetaData.formErrors.selectLocationType")}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={formSubmitAttempts > 0 && !localForm.address}>
            <FormLabel>{t("localeMetaData.address")}</FormLabel>

            <StreetSelector
              cb={x => {
                updateLocalForm(x.name, "address");
                updateLocalForm(x.regionId, "regionId" as keyof typeof localForm);
              }}
              value={localForm.address}
            />
            <FormErrorMessage>{t("localeMetaData.formErrors.enterAddress")}</FormErrorMessage>
          </FormControl>
          <FormControl>
            <FormLabel>{t("localeMetaData.address")}</FormLabel>
            <Input
              placeholder="#"
              onChange={e => {
                updateLocalForm(e.target.value, "addressExtra");
              }}
              value={localForm.addressExtra}
            />
          </FormControl>

          <FormControl isRequired isInvalid={formSubmitAttempts > 0 && !localForm.schedule}>
            <FormLabel>{t("localeMetaData.refillSchedule")}</FormLabel>
            <Select
              placeholder={t("localeMetaData.selectRefillSchedule") as string}
              onChange={e => updateLocalForm(e.target.value, "schedule")}
              value={localForm.schedule}>
              {Object.entries(RefillScheduleRecord).map(([key, value]) => (
                <option key={key} value={value}>
                  {t("enums.refillSchedule." + value)}
                </option>
              ))}
            </Select>
            <FormErrorMessage>
              {t("localeMetaData.formErrors.selectRefillSchedule")}
            </FormErrorMessage>
          </FormControl>

          <FormControl
            isRequired={localForm.schedule == RefillSchedule.INTERVAL}
            isDisabled={localForm.schedule != RefillSchedule.INTERVAL}
            isInvalid={
              formSubmitAttempts > 0 &&
              localForm.schedule == RefillSchedule.INTERVAL &&
              !localForm.daysBetweenRefills
            }>
            <FormLabel>{t("localeMetaData.daysBetweenRefill")}</FormLabel>
            <Input
              placeholder="# of days"
              type="number"
              onChange={e => {
                updateLocalForm(e.target.value, "daysBetweenRefills");
              }}
              value={localForm.daysBetweenRefills}
            />
            <FormErrorMessage>{t("localeMetaData.formErrors.daysBetween")}</FormErrorMessage>
          </FormControl>

          <FormControl>
            <FormLabel>{t("localeMetaData.comments")}</FormLabel>
            <Input
              placeholder={t("localeMetaData.comment") as string}
              onChange={e => {
                updateLocalForm(e.target.value, "comments");
              }}
              value={localForm.comments}
            />
            <FormErrorMessage>{t("localeMetaData.formErrors.enterComment")}</FormErrorMessage>
          </FormControl>

          <FormControl>
            <FormLabel>{t("localeMetaData.selectAnImage")}</FormLabel>
            <Button colorScheme="blue" onClick={saveImage}>
              {image ? t("localeMetaData.reSelectImage") : t("localeMetaData.selectImage")}
            </Button>
            <FormErrorMessage>{t("localeMetaData.formErrors.selectAnImage")}</FormErrorMessage>
          </FormControl>
        </Box>
        <Spacer />
        <Box>
          <Heading size="md" mb={4}>
            Tank
          </Heading>
          <FormControl isRequired isInvalid={formSubmitAttempts > 0 && !localForm.tankNumber}>
            <FormLabel>{t("localeMetaData.tankNumber")}</FormLabel>
            <Input
              onChange={e => {
                const value = parseInt(e.target.value);
                if (isNaN(value)) {
                  updateLocalForm("", "tankNumber");
                } else {
                  updateLocalForm(value, "tankNumber");
                }
              }}
              value={localForm.tankNumber}
            />
            <FormErrorMessage>{t("localeMetaData.formErrors.tankNumber")}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={formSubmitAttempts > 0 && !localForm.tankCapacity}>
            <FormLabel>{t("localeMetaData.tankCapacity")}</FormLabel>
            <InputGroup>
              <NumberInput
                onChange={e => {
                  const value = parseInt(e);
                  if (isNaN(value)) {
                    updateLocalForm("", "tankCapacity");
                  } else {
                    updateLocalForm(value, "tankCapacity");
                  }
                }}
                value={localForm.tankCapacity}>
                <NumberInputField />
              </NumberInput>
              <InputRightAddon>{t("localeMetaData.liters")}</InputRightAddon>
            </InputGroup>
            <FormErrorMessage>{t("localeMetaData.formErrors.tankCapacity")}</FormErrorMessage>
          </FormControl>

          <FormControl
            isRequired
            isInvalid={formSubmitAttempts > 0 && !localForm.minimumFuelAmount}>
            <FormLabel>{t("localeMetaData.minFuelAmount")}</FormLabel>
            <InputGroup>
              <NumberInput
                onChange={e => {
                  const value = parseInt(e);
                  if (isNaN(value)) {
                    updateLocalForm("", "minimumFuelAmount");
                  } else {
                    updateLocalForm(value, "minimumFuelAmount");
                  }
                }}
                value={localForm.minimumFuelAmount}>
                <NumberInputField />
              </NumberInput>
              <InputRightAddon>{t("localeMetaData.liters")}</InputRightAddon>
            </InputGroup>
            <FormErrorMessage>{t("localeMetaData.formErrors.minFuelAmount")}</FormErrorMessage>
          </FormControl>

          <FormControl
            isRequired
            isInvalid={formSubmitAttempts > 0 && !localForm.estimateFuelConsumption}>
            <FormLabel>{t("localeMetaData.dailyFuelConsumptionEstimate")}</FormLabel>
            <InputGroup>
              <NumberInput
                onChange={e => {
                  const value = parseInt(e);
                  if (isNaN(value)) {
                    updateLocalForm("", "estimateFuelConsumption");
                  } else {
                    updateLocalForm(value, "estimateFuelConsumption");
                  }
                }}
                value={localForm.estimateFuelConsumption}>
                <NumberInputField />
              </NumberInput>
              <InputRightAddon>liters</InputRightAddon>
            </InputGroup>
            <FormErrorMessage>
              {t("localeMetaData.formErrors.dailyFuelConsumptionEstimate")}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={formSubmitAttempts > 0 && localForm.fuelType <= -1} isRequired>
            <FormLabel id="fuel-type">{t("localeMetaData.selectFuelType")}:</FormLabel>
            <Select
              onChange={e => updateLocalForm(e.target.value, "fuelType")}
              value={localForm.fuelType}
              placeholder={t("localeMetaData.selectFuelType") as string}>
              {Object.entries(FuelTypeRecord).map(([a, b]) => (
                <option key={b} value={b}>
                  {t("enums.fuelType." + b)}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{t("localeMetaData.formErrors.allowedFuelType")}</FormErrorMessage>
          </FormControl>
        </Box>
        <Spacer />
        <Box>
          <Heading size="md" mb={4}>
            {t("localeMetaData.debtor")}
          </Heading>
          <FormControl
            isInvalid={
              formSubmitAttempts > 0 && !mainDebtorId && !baseDebtorId && !upcomingDebtorId
            }>
            <FormLabel>{t("localeMetaData.main")}</FormLabel>
            <DebtorSelector cb={x => setMainDebtorId(x?.dbId)} />

            <FormLabel>{t("localeMetaData.base")}</FormLabel>
            <DebtorSelector cb={x => setBaseDebtorId(x?.dbId)} />
            <FormLabel>{t("localeMetaData.upcoming")}</FormLabel>
            <DebtorSelector cb={x => setUpcomingDebtorId(x?.dbId)} />
            <FormLabel>{t("localeMetaData.selectDate")}</FormLabel>
            <DatePicker
              selectedDate={debtorDate}
              onChange={(date: Date) => setDebtorDate(date)}
              // value={localForm.fuelType}
              showPopperArrow={false}
            />
            <FormErrorMessage>{t("localeMetaData.formErrors.selectDebtorId")}</FormErrorMessage>
          </FormControl>
        </Box>
      </HStack>
      <Center mt={25}>
        <Button
          colorScheme="green"
          type="submit"
          rightIcon={<MdCheck />}
          onClick={() => setFormSubmitAttempts(x => x + 1)}>
          {t("localeMetaData.submit")}
        </Button>
      </Center>
    </form>
  );
};

export default LocaleMetaDataComp;
