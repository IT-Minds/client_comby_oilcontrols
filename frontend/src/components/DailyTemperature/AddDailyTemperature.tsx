import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  VStack
} from "@chakra-ui/react";
import RegionSelector from "components/RegionSelector/RegionSelector";
import { authGuardHOC } from "hoc/authGuardHOC";
import { useEffectAsync } from "hooks/useEffectAsync";
import { Locale } from "i18n/Locale";
import { useI18n } from "next-rosetta";
import React, { FC, FormEvent, useCallback, useState } from "react";
import { MdCheck } from "react-icons/md";
import { genStreetClient } from "services/backend/apiClients";
import { Action, ICreateDailyTemperatureCommand } from "services/backend/nswagts";
import { formatInputNumber, parseInputToNumber } from "utils/formatNumber";
import { logger } from "utils/logger";

import DatePicker from "../DatePicker/DatePicker";

type Props = {
  submitCallback: (addCouponForm: ICreateDailyTemperatureCommand) => void;
};

const AddDailyTemperatureComp: FC<Props> = ({ submitCallback }) => {
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

  useEffectAsync(async () => {
    const client = await genStreetClient();
    const data = await client.get();
  }, []);

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
      if (localAddDailyTemperatureForm.regionId) {
        submitCallback(localAddDailyTemperatureForm);
      }
      setFormSubmitAttempts(0);
      event.preventDefault();
    },
    [localAddDailyTemperatureForm]
  );

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <VStack align="center" justify="center">
          <FormControl isRequired isInvalid={formSubmitAttempts > 0}>
            <FormLabel>{t("dailyTemperature.selectRegion")}</FormLabel>

            <RegionSelector
              cb={x => {
                updateLocalForm(
                  x.regionId,
                  "regionId" as keyof typeof localAddDailyTemperatureForm
                );
              }}
              value={localAddDailyTemperatureForm.regionId}
            />
            <FormErrorMessage>{t("dailyTemperature.formErrors.selectRegion")}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>{t("dailyTemperature.selectDate")}:</FormLabel>
            <DatePicker
              selectedDate={date}
              onChange={(x: Date) => setDate(x)}
              showPopperArrow={false}
            />
          </FormControl>
          <FormControl
            isRequired
            isInvalid={formSubmitAttempts > 0 && !localAddDailyTemperatureForm.temperature}>
            <FormLabel>{t("dailyTemperature.temperature")}:</FormLabel>
            <Stack spacing={4}>
              <InputGroup size="sm">
                <Input
                  placeholder="Degrees"
                  type="number"
                  step={0.01}
                  onChange={e =>
                    updateLocalForm(
                      parseInputToNumber(formatInputNumber(e.target.value)),
                      "temperature"
                    )
                  }
                />
                <InputRightElement>°</InputRightElement>
              </InputGroup>
            </Stack>
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

export default authGuardHOC(AddDailyTemperatureComp, Action.SET_TEMPERATURE);
