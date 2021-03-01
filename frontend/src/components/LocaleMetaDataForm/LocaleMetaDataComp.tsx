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
import { useEffectAsync } from "hooks/useEffectAsync";
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
  RemoveDebtorFromLocationCommand,
  UpdateDebtorOnLocationCommand
} from "services/backend/nswagts";
import getLocale from "utils/datepickerLocale";
import { logger } from "utils/logger";

type Props = {
  submitCallback: (
    reportForm: ILocationDetailsDto,
    addDebtors: AddDebtorToLocationCommand[],
    updateDebtors: UpdateDebtorOnLocationCommand[],
    removeDebtors: RemoveDebtorFromLocationCommand[],
    image?: File
  ) => void;
  localeMetaData?: ILocationDetailsDto;
};

const LocaleMetaDataComp: FC<Props> = ({ submitCallback, localeMetaData }) => {
  const { t } = useI18n<Locale>();

  const [mainDebtorId, setMainDebtorId] = useState(null);
  const [baseDebtorId, setBaseDebtorId] = useState(null);
  const [upcomingDebtorId, setUpcomingDebtorId] = useState(null);
  const [debtorDate, setDebtorDate] = useState(new Date());
  const [inactiveDate, setInactiveDate] = useState(null);
  const [image, setImage] = useState<File>(null);
  const [locale, setLocale] = useState<globalThis.Locale>();

  const addDebtors: AddDebtorToLocationCommand[] = [];
  const updateDebtors: UpdateDebtorOnLocationCommand[] = [];
  const removeDebtors: RemoveDebtorFromLocationCommand[] = [];

  const [localForm, setLocalForm] = useState<ILocationDetailsDto>({
    address: "",
    addressExtra: "",
    comments: "",
    estimateFuelConsumption: 0,
    regionId: null,
    minimumFuelAmount: 0,
    schedule: -1,
    tankCapacity: 0,
    bstNumber: "0",
    tankType: -1,
    fuelType: -1,
    daysBetweenRefills: 0,
    baseDebtorId: null,
    mainDebtorId: null,
    upcomingDebtorId: null,
    inactiveSince: null,
    ...localeMetaData
  });

  const [formSubmitAttempts, setFormSubmitAttempts] = useState(0);

  useEffectAsync(async () => {
    const lang = await getLocale();
    setLocale(lang);
  }, []);

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

      setDebtors(mainDebtorId, LocationDebtorType.MAIN, localForm.mainDebtorId);
      setDebtors(baseDebtorId, LocationDebtorType.BASE, localForm.baseDebtorId);
      setDebtors(upcomingDebtorId, LocationDebtorType.UPCOMING, localForm.upcomingDebtorId);

      localForm.inactiveSince = inactiveDate;

      submitCallback(localForm, addDebtors, updateDebtors, removeDebtors, image);
      setFormSubmitAttempts(0);
    },
    [
      submitCallback,
      localForm,
      mainDebtorId,
      baseDebtorId,
      upcomingDebtorId,
      debtorDate,
      image,
      inactiveDate
    ]
  );

  const setDebtors = (debtorId: number, debtorType: LocationDebtorType, originalId: number) => {
    if (debtorId > 0 && (originalId === null || originalId === 0)) {
      addDebtors.push(
        new AddDebtorToLocationCommand({
          debtorId,
          debtorType,
          changeDate: debtorDate
        })
      );
    } else if (debtorId > 0 && originalId > 0) {
      /*
        TODO: This is supposed to be an "update", but
        as the BE is not ready for this yet, we have to
        make a delete first, and then an add. When ready
        use the commented out code below, and remove
        the "removeDebtors" and the "addDebtors" below it.
      */

      // updateDebtors.push(
      //   new UpdateDebtorToLocationCommand({
      //     debtorId,
      //     debtorType,
      //     changeDate: debtorDate
      //   })
      // );

      //TODO: Remove when backend is ready for the UPDATE command
      removeDebtors.push(
        new RemoveDebtorFromLocationCommand({
          debtorId: originalId
        })
      );

      //TODO: Remove when backend is ready for the UPDATE command
      addDebtors.push(
        new AddDebtorToLocationCommand({
          debtorId,
          debtorType,
          changeDate: debtorDate
        })
      );
    } else if (debtorId === 0 && originalId > 0) {
      removeDebtors.push(
        new RemoveDebtorFromLocationCommand({
          debtorId: originalId
        })
      );
    }
  };

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
              {Object.entries(TankTypeRecord).map(([, b]) => (
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
          <FormControl isRequired isInvalid={formSubmitAttempts > 0 && !localForm.bstNumber}>
            <FormLabel>{t("localeMetaData.bstNumber")}</FormLabel>
            <Input
              onChange={e => updateLocalForm(e.target.value, "bstNumber")}
              value={localForm.bstNumber}
            />
            <FormErrorMessage>{t("localeMetaData.formErrors.bstNumber")}</FormErrorMessage>
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
              placeholder={t("localeMetaData.numberOfDays") as string}
              type="number"
              onChange={e => {
                updateLocalForm(e.target.value, "daysBetweenRefills");
              }}
              value={localForm.daysBetweenRefills}
            />
            <FormErrorMessage>{t("localeMetaData.formErrors.daysBetween")}</FormErrorMessage>
          </FormControl>

          <FormControl>
            <FormLabel>{t("localeMetaData.inactiveSince")}:</FormLabel>
            <DatePicker
              locale={locale}
              selectedDate={inactiveDate}
              onChange={(x: Date) => setInactiveDate(x)}
              showPopperArrow={false}
            />
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
        </Box>
        <Spacer />
        <Box>
          <Heading size="md" mb={4}>
            Tank
          </Heading>
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
              {Object.entries(FuelTypeRecord).map(([, b]) => (
                <option key={b} value={b}>
                  {t("enums.fuelType." + b)}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{t("localeMetaData.formErrors.allowedFuelType")}</FormErrorMessage>
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
            {t("localeMetaData.debtor")}
          </Heading>
          <FormControl
            isInvalid={
              formSubmitAttempts > 0 && !mainDebtorId && !baseDebtorId && !upcomingDebtorId
            }>
            <FormLabel>{t("localeMetaData.main")}</FormLabel>
            <DebtorSelector cb={x => setMainDebtorId(x?.dbId)} value={localForm.mainDebtorId} />

            <FormLabel>{t("localeMetaData.base")}</FormLabel>
            <DebtorSelector cb={x => setBaseDebtorId(x?.dbId)} value={localForm.baseDebtorId} />
            <FormLabel>{t("localeMetaData.upcoming")}</FormLabel>
            <DebtorSelector
              cb={x => setUpcomingDebtorId(x?.dbId)}
              value={localForm.upcomingDebtorId}
            />
            <FormLabel>{t("localeMetaData.selectDate")}</FormLabel>
            <DatePicker
              locale={locale}
              selectedDate={debtorDate}
              onChange={(date: Date) => setDebtorDate(date)}
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
