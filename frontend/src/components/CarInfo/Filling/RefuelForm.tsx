import {
  Button,
  Center,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberInputField,
  Select,
  useDisclosure
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useI18n } from "next-rosetta";
import React, { FC, useCallback, useState } from "react";
import { GiGasPump } from "react-icons/gi";
import { MdAdd } from "react-icons/md";
import { FuelTypeRecord } from "services/backend/ext/enumConvertor";
import { FuelType } from "services/backend/nswagts";

import { TruckRefuelForm } from "./TruckRefuelForm";

type Props = {
  fillData: (addCouponForm: TruckRefuelForm) => void;
};

const RefuelForm: FC<Props> = ({ fillData }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useI18n<Locale>();
  const { locale } = useRouter();

  const formatter = Intl.DateTimeFormat(locale);

  const [localFillingForm, setLocalFillingForm] = useState<TruckRefuelForm>({
    fillAmount: null,
    cardNumber: null,
    date: new Date(),
    fuelType: null
  });

  const updateLocalForm = useCallback((value: unknown, key: keyof TruckRefuelForm) => {
    setLocalFillingForm(form => {
      (form[key] as unknown) = value;
      return form;
    });
  }, []);

  const addFilling = useCallback(() => {
    if (localFillingForm.fillAmount && localFillingForm.cardNumber) {
      fillData(localFillingForm);
      onClose();
    }
  }, [localFillingForm]);

  const [formSubmitAttempts, setFormSubmitAttempts] = useState(0);

  return (
    <>
      <Button colorScheme="yellow" onClick={onOpen} leftIcon={<GiGasPump />}>
        {t("mytruck.refuel.trigger")}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("mytruck.refuel.trigger")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl
              isInvalid={
                formSubmitAttempts > 0 &&
                Object.values(FuelTypeRecord).every(
                  key => localFillingForm.fuelType !== (FuelType[key] as unknown)
                )
              }
              isRequired>
              <FormLabel id="fuel-type">Select fuel type:</FormLabel>
              <Select
                onChange={e => updateLocalForm(FuelType[Number(e.target.value)], "fuelType")}
                placeholder="Select option">
                {Object.entries(FuelTypeRecord).map(([a, b]) => (
                  <option key={b} value={b}>
                    {t("enums.fuelType." + b)}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>Please select one of the allowed fuel types</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={formSubmitAttempts > 0 && !localFillingForm.fillAmount}
              isRequired>
              <FormLabel>Filling amount (in liters):</FormLabel>
              <NumberInput
                placeholder="Fill amount"
                onChange={value => updateLocalForm(value, "fillAmount")}>
                <NumberInputField />
              </NumberInput>
              <FormErrorMessage>Please enter amount filled</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={formSubmitAttempts > 0 && !localFillingForm.cardNumber}
              isRequired>
              <FormLabel>Card number:</FormLabel>
              <NumberInput
                placeholder="Card number"
                onChange={value => updateLocalForm(value, "cardNumber")}>
                <NumberInputField />
              </NumberInput>
              <FormErrorMessage>Please enter card number</FormErrorMessage>
            </FormControl>
            <FormControl isReadOnly>
              <FormLabel>Date:</FormLabel>
              <Input value={formatter.format(new Date(localFillingForm.date))} />
              <FormErrorMessage>Please enter card number</FormErrorMessage>
            </FormControl>

            <Center>
              <Button
                mt={4}
                colorScheme="blue"
                rightIcon={<MdAdd />}
                type="submit"
                onClick={() => {
                  setFormSubmitAttempts(x => x + 1);
                  addFilling();
                }}>
                {t("mytruck.refuel.complete")}
              </Button>
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RefuelForm;
