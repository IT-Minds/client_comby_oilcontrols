import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  NumberInput,
  NumberInputField,
  Select,
  VStack
} from "@chakra-ui/react";
import { Locale } from "i18n/Locale";
import { useI18n } from "next-rosetta";
import React, { FC, FormEvent, useCallback, useState } from "react";
import { MdCheck } from "react-icons/md";
import { ICreateDailyTemperatureCommand } from "services/backend/nswagts";
import DropdownType from "types/DropdownType";
import { formatInputNumber, parseInputToNumber } from "utils/formatNumber";
import { logger } from "utils/logger";

import DatePicker from "./date-picker";

type Props = {
  submitCallback: (addCouponForm: ICreateDailyTemperatureCommand) => void;
  regions: DropdownType[];
};

const AddDailyTemperatureComp: FC<Props> = ({ submitCallback, regions: regions = [] }) => {
  const [
    localAddDailyTemperatureForm,
    setLocalAddDailyTemperatureForm
  ] = useState<ICreateDailyTemperatureCommand>({
    date: null,
    regionId: null,
    temperature: null
  });

  const { t } = useI18n<Locale>();

  const [formSubmitAttempts, setFormSubmitAttempts] = useState(0);
  const [date, setDate] = useState<Date>(new Date());

  const updateLocalForm = useCallback(
    (value: unknown, key: keyof ICreateDailyTemperatureCommand) => {
      setLocalAddDailyTemperatureForm(form => {
        (form[key] as unknown) = value;
        return form;
      });
    },
    []
  );

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      logger.debug("Submitting form AddDailyTemperatureComp");
      localAddDailyTemperatureForm.date = date;
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
              regions.every(r => localAddDailyTemperatureForm.regionId !== parseFloat(r.id))
            }
            isRequired>
            <FormLabel>{t("dailyTemperature.selectRegion")}:</FormLabel>
            <Select
              placeholder={t("dailyTemperature.selectRegion")}
              onChange={e => updateLocalForm(e.target.value, "regionId")}>
              {regions.map(region => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{t("dailyTemperature.formErrors.selectRegion")}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>{t("dailyTemperature.selectDate")}:</FormLabel>
            <DatePicker
              selectedDate={date}
              onChange={date => setDate(date)}
              showPopperArrow={false}
            />
          </FormControl>
          <FormControl
            isRequired
            isInvalid={formSubmitAttempts > 0 && !localAddDailyTemperatureForm.temperature}>
            <FormLabel>{t("dailyTemperature.temperature")}:</FormLabel>
            <NumberInput
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
            <FormErrorMessage>{t("dailyTemperature.formErrors.inputTemperature")}</FormErrorMessage>
          </FormControl>

          <Button
            colorScheme="green"
            type="submit"
            rightIcon={<MdCheck />}
            onClick={() => setFormSubmitAttempts(x => x + 1)}>
            {t("actions.submit")}
          </Button>
        </VStack>
      </form>
    </Container>
  );
};

export default AddDailyTemperatureComp;
