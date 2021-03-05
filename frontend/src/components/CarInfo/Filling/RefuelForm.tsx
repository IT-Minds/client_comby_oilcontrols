import {
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
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
import DatePicker from "components/DatePicker/DatePicker";
import { TruckContext } from "contexts/TruckContext";
import { useRouter } from "next/router";
import { useI18n } from "next-rosetta";
import React, { FC, useCallback, useContext, useState } from "react";
import { GiGasPump } from "react-icons/gi";
import { MdAdd } from "react-icons/md";
import { FuelTypeRecord } from "services/backend/ext/enumConvertor";
import { FuelType } from "services/backend/nswagts";

import { TruckRefuelForm } from "./TruckRefuelForm";

const RefuelForm: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useI18n<Locale>();
  const { locale } = useRouter();

  const { completeTruckRefuel, reloadData } = useContext(TruckContext);
  const [date, setDate] = useState(new Date());

  const [localFillingForm, setLocalFillingForm] = useState<TruckRefuelForm>({
    fillAmount: null,
    cardNumber: null,
    date: null,
    fuelType: null
  });

  const updateLocalForm = useCallback((value: unknown, key: keyof TruckRefuelForm) => {
    setLocalFillingForm(form => {
      (form[key] as unknown) = value;
      return form;
    });
  }, []);

  const addFilling = useCallback(async () => {
    if (localFillingForm.fillAmount && localFillingForm.cardNumber && localFillingForm.fuelType) {
      localFillingForm.date = date;
      await completeTruckRefuel(localFillingForm);
      await reloadData();
      onClose();
    }
  }, [localFillingForm, date]);

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
              isInvalid={formSubmitAttempts > 0 && !localFillingForm.fuelType}
              isRequired>
              <FormLabel id="fuel-type">{t("mytruck.refuel.selectFuelType")}</FormLabel>
              <Select
                onChange={e => updateLocalForm(FuelType[Number(e.target.value)], "fuelType")}
                placeholder={t("mytruck.refuel.selectFuelType") as string}>
                {Object.entries(FuelTypeRecord).map(([a, b]) => (
                  <option key={b} value={b}>
                    {t("enums.fuelType." + b)}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>
                {t("mytruck.refuel.formErrors.selectAllowedFuelType")}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={formSubmitAttempts > 0 && !localFillingForm.fillAmount}
              isRequired>
              <FormLabel>{t("mytruck.refuel.fillingAmount")}</FormLabel>
              <NumberInput onChange={value => updateLocalForm(value, "fillAmount")}>
                <NumberInputField />
              </NumberInput>
              <FormErrorMessage>
                {t("mytruck.refuel.formErrors.enterAmountFilled")}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={formSubmitAttempts > 0 && !localFillingForm.cardNumber}
              isRequired>
              <FormLabel>{t("mytruck.refuel.cardNumber")}</FormLabel>
              <NumberInput onChange={value => updateLocalForm(value, "cardNumber")}>
                <NumberInputField />
              </NumberInput>
              <FormErrorMessage>{t("mytruck.refuel.formErrors.enterCardNumber")}</FormErrorMessage>
            </FormControl>
            <FormControl>
              <FormLabel>{t("mytruck.refuel.date")}</FormLabel>
              <DatePicker
                locale={locale}
                selectedDate={date}
                onChange={(date: Date) => setDate(date)}
                showPopperArrow={false}
              />
              <FormErrorMessage>{t("mytruck.refuel.formErrors.chooseDate")}</FormErrorMessage>
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
