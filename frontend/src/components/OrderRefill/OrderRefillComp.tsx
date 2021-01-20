import "react-datepicker/dist/react-datepicker.css";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select,
  Table,
  TableCaption,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure
} from "@chakra-ui/react";
import { Locale } from "i18n/Locale";
import { useI18n } from "next-rosetta";
import { stringify } from "querystring";
import React, { FC, FormEvent, useCallback, useRef, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { MdCheck } from "react-icons/md";
import DropdownType from "types/DropdownType";
import { logger } from "utils/logger";

import DatePicker from "./date-picker";
import { OrderRefillForm } from "./OrderRefillForm";

type Props = {
  submitCallback: (orderRefillForm: OrderRefillForm) => void;
  locations: DropdownType[];
};

interface LocationDates {
  locationId: string;
  date: Date;
}

const OrderRefillComp: FC<Props> = ({ submitCallback, locations = [] }) => {
  const [localOrderRefillForm, setLocalOrderRefillForm] = useState<OrderRefillForm>({
    locationId: "",
    expectedDeliveryDate: 0,
    routeId: ""
  });

  const cancelRef = useRef();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setLoading] = useState(false);
  const [selectedlocationId, setSelectedLocationId] = useState(null);
  const [modalDate, setModalDate] = useState(null);
  const [dates, setDates] = useState<LocationDates[]>([]);

  const { t } = useI18n<Locale>();

  const [formSubmitAttempts, setFormSubmitAttempts] = useState(0);

  const updateLocalForm = useCallback((value: unknown, key: keyof OrderRefillForm) => {
    setLocalOrderRefillForm(form => {
      (form[key] as unknown) = value;
      return form;
    });
  }, []);

  const addDateToLocation = useCallback(() => {
    const exists = dates.find(d => d.locationId === selectedlocationId);
    if (exists) {
      exists.date = modalDate;
      const index = dates.findIndex(d => d.locationId === selectedlocationId);
      const clone = [...dates];
      clone[index] = exists;
      setDates(clone);
    } else {
      setDates(oldArray => [...oldArray, { locationId: selectedlocationId, date: modalDate }]);
    }

    onClose();
  }, [dates, selectedlocationId, modalDate]);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      logger.debug("Submitting form OrderRefillComp");
      submitCallback(localOrderRefillForm);
      setFormSubmitAttempts(0);
      event.preventDefault();
    },
    [localOrderRefillForm]
  );

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <Table variant="striped" colorScheme="teal">
          <TableCaption placement="top">Filling overview</TableCaption>
          <Thead>
            <Tr>
              <Th>Location</Th>
              <Th>Date</Th>
              <Th>Selected Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {locations.map(location => {
              return (
                <Tr key={location.id}>
                  <Td>{location.name}</Td>
                  <Td>
                    <Button
                      colorScheme="blue"
                      onClick={() => {
                        setSelectedLocationId(location.id);
                        onOpen();
                      }}
                      isLoading={isLoading}>
                      {dates.find(d => d.locationId === location.id)?.date
                        ? "Change date"
                        : "Choose date"}
                    </Button>
                  </Td>
                  <Td>
                    {dates.find(d => d.locationId === location.id)?.date.toDateString() ?? ""}
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>

        <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                {t("coupons.invalidate.invalidate")}
              </AlertDialogHeader>

              <AlertDialogBody>
                <DatePicker
                  selectedDate={
                    dates?.find(d => d.locationId === selectedlocationId)?.date ?? modalDate
                  }
                  onChange={date => setModalDate(date)}
                  showPopperArrow={false}
                />
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  {t("actions.cancel")}
                </Button>
                <Button colorScheme="red" onClick={() => addDateToLocation()} ml={3}>
                  {t("actions.invalidate")}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>

        <Button
          colorScheme="green"
          type="submit"
          rightIcon={<MdCheck />}
          onClick={() => setFormSubmitAttempts(x => x + 1)}>
          Submit
        </Button>
      </form>
    </Container>
  );
};

export default OrderRefillComp;
