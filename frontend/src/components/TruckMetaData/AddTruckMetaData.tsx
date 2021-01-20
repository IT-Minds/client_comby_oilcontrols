import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Textarea,
  VStack
} from "@chakra-ui/react";
import { Locale } from "i18n/Locale";
import { useI18n } from "next-rosetta";
import React, { FC, FormEvent, useCallback, useState } from "react";
import { MdCheck } from "react-icons/md";
import { logger } from "utils/logger";

import { AddTruckMetaDataForm } from "./AddTruckMetaDataForm";

type Props = {
  submitCallback: (addTruckMetaDataForm: AddTruckMetaDataForm) => void;
  //truckMetaData: TYPE;
};

const AddTruckMetaData: FC<Props> = ({ submitCallback }) => {
  const [localAddTruckMetaDataForm, setlocalAddTruckMetaDataForm] = useState<AddTruckMetaDataForm>({
    startNumber: 123, //dummy
    carNumber: null,
    description: null,
    name: null,
    tankSize: null
  });

  const { t } = useI18n<Locale>();

  const [formSubmitAttempts, setFormSubmitAttempts] = useState(0);

  const updateLocalForm = useCallback((value: unknown, key: keyof AddTruckMetaDataForm) => {
    setlocalAddTruckMetaDataForm(form => {
      (form[key] as unknown) = value;
      return form;
    });
  }, []);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      logger.debug("Submitting form AddTruckMetaDataForm");

      submitCallback(localAddTruckMetaDataForm);
      setFormSubmitAttempts(0);
      event.preventDefault();
    },
    [localAddTruckMetaDataForm]
  );

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <VStack align="center" justify="center">
          <FormControl>
            <FormLabel>{t("truckMetaData.startNumber")}:</FormLabel>
            <Input isReadOnly value={localAddTruckMetaDataForm.startNumber}></Input>
          </FormControl>

          <FormControl
            isRequired
            isInvalid={formSubmitAttempts > 0 && !localAddTruckMetaDataForm.carNumber}>
            <FormLabel> {t("truckMetaData.carNumber")}:</FormLabel>
            <NumberInput
              min={0}
              max={999}
              onChange={value => {
                updateLocalForm(value, "carNumber");
              }}>
              <NumberInputField />
            </NumberInput>
            <FormErrorMessage>{t("truckMetaData.formError.carNumber")}</FormErrorMessage>
          </FormControl>

          <FormControl
            isRequired
            isInvalid={formSubmitAttempts > 0 && !localAddTruckMetaDataForm.name}>
            <FormLabel>{t("truckMetaData.carName")}:</FormLabel>
            <Input
              onChange={e => {
                updateLocalForm(e.target.value, "name");
              }}></Input>
            <FormErrorMessage>{t("truckMetaData.formError.carName")}</FormErrorMessage>
          </FormControl>

          <FormControl
            isRequired
            isInvalid={formSubmitAttempts > 0 && !localAddTruckMetaDataForm.description}>
            <FormLabel>{t("truckMetaData.formError.carNumber")}:</FormLabel>
            <Textarea
              onChange={e => {
                updateLocalForm(e.target.value, "description");
              }}></Textarea>
            <FormErrorMessage>{t("truckMetaData.formError.description")}</FormErrorMessage>
          </FormControl>

          <FormControl
            isRequired
            isInvalid={formSubmitAttempts > 0 && !localAddTruckMetaDataForm.tankSize}>
            <FormLabel>{t("truckMetaData.tankSize")}:</FormLabel>
            <NumberInput
              min={0}
              onChange={value => {
                updateLocalForm(value, "tankSize");
              }}>
              <NumberInputField />
            </NumberInput>
            <FormErrorMessage>{t("truckMetaData.formError.tankSize")}</FormErrorMessage>
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

export default AddTruckMetaData;
