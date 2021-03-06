import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  NumberInput,
  NumberInputField,
  Textarea,
  VStack
} from "@chakra-ui/react";
import UserSelector from "components/UserSelector/UserSelector";
import { Locale } from "i18n/Locale";
import { useI18n } from "next-rosetta";
import React, { FC, FormEvent, useCallback, useEffect, useState } from "react";
import { MdCheck } from "react-icons/md";
import { TruckInfoDto, TruckInfoIdDto } from "services/backend/nswagts";
import { logger } from "utils/logger";

type Props = {
  submitCallback: (truckMetaDataForm: TruckInfoDto) => void;
  truckMetaData?: TruckInfoIdDto;
};

const AddTruckMetaData: FC<Props> = ({ submitCallback, truckMetaData }) => {
  const [localTruckMetaDataForm, setLocalTruckMetaDataForm] = useState<TruckInfoDto>(
    new TruckInfoDto({
      refillNumber: 0,
      truckIdentifier: "0",
      description: "",
      name: "",
      tankCapacity: 0,
      driverId: null
    })
  );

  useEffect(() => {
    if (truckMetaData) {
      setLocalTruckMetaDataForm(truckMetaData);
    }
  }, [truckMetaData]);

  const { t } = useI18n<Locale>();

  const [formSubmitAttempts, setFormSubmitAttempts] = useState(0);

  const updateLocalForm = useCallback((value: unknown, key: keyof TruckInfoDto) => {
    setLocalTruckMetaDataForm(form => {
      (form[key] as unknown) = value;
      return new TruckInfoDto(form);
    });
  }, []);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      logger.debug("Submitting form AddTruckMetaDataForm");

      if (localTruckMetaDataForm.driverId) {
        submitCallback(localTruckMetaDataForm);
      }
      setFormSubmitAttempts(0);
      event.preventDefault();
    },
    [localTruckMetaDataForm]
  );

  return (
    <form onSubmit={handleSubmit}>
      <VStack align="center" justify="center">
        <FormControl
          isRequired
          isInvalid={formSubmitAttempts > 0 && !localTruckMetaDataForm.driverId}>
          <FormLabel>{t("truckMetaData.driver")}</FormLabel>

          <UserSelector
            cb={x => {
              updateLocalForm(x.id, "driverId");
            }}
            value={localTruckMetaDataForm.driverId ? localTruckMetaDataForm.driverId : 77}
          />
          <FormErrorMessage>{t("truckMetaData.formError.driver")}</FormErrorMessage>
        </FormControl>
        <FormControl>
          <FormLabel>{t("truckMetaData.startNumber")}</FormLabel>
          <Input
            value={localTruckMetaDataForm.refillNumber}
            onChange={e => updateLocalForm(e.target.value, "refillNumber")}
          />
        </FormControl>
        <FormControl
          isRequired
          isInvalid={formSubmitAttempts > 0 && !localTruckMetaDataForm.truckIdentifier}>
          <FormLabel>{t("truckMetaData.carNumber")}</FormLabel>
          <Input
            value={localTruckMetaDataForm.truckIdentifier}
            onChange={e => updateLocalForm(e.target.value, "truckIdentifier")}
          />
          <FormErrorMessage>{t("truckMetaData.formError.carNumber")}</FormErrorMessage>
        </FormControl>
        <FormControl isRequired isInvalid={formSubmitAttempts > 0 && !localTruckMetaDataForm.name}>
          <FormLabel>{t("truckMetaData.carName")}</FormLabel>
          <Input
            value={localTruckMetaDataForm.name}
            onChange={e => {
              updateLocalForm(e.target.value, "name");
            }}
          />
          <FormErrorMessage>{t("truckMetaData.formError.carName")}</FormErrorMessage>
        </FormControl>
        <FormControl
          isRequired
          isInvalid={formSubmitAttempts > 0 && !localTruckMetaDataForm.description}>
          <FormLabel>{t("truckMetaData.description")}</FormLabel>
          <Textarea
            value={localTruckMetaDataForm.description}
            onChange={e => {
              updateLocalForm(e.target.value, "description");
            }}></Textarea>
          <FormErrorMessage>{t("truckMetaData.formError.description")}</FormErrorMessage>
        </FormControl>
        <FormControl
          isRequired
          isInvalid={formSubmitAttempts > 0 && !localTruckMetaDataForm.tankCapacity}>
          <FormLabel>{t("truckMetaData.tankSize")}</FormLabel>
          <InputGroup>
            <NumberInput
              value={localTruckMetaDataForm.tankCapacity}
              min={0}
              onChange={value => {
                updateLocalForm(value, "tankCapacity");
              }}>
              <NumberInputField />
            </NumberInput>

            <InputRightAddon>{t("truckMetaData.liters")}</InputRightAddon>
          </InputGroup>
          <FormErrorMessage>{t("truckMetaData.formError.tankSize")}</FormErrorMessage>
        </FormControl>
        <Button
          colorScheme="green"
          type="submit"
          rightIcon={<MdCheck />}
          onClick={() => setFormSubmitAttempts(x => x + 1)}>
          {t("truckMetaData.submit")}
        </Button>
      </VStack>
    </form>
  );
};

export default AddTruckMetaData;
