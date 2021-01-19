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
  Th,
  Thead,
  Tr,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import { Locale } from "i18n/Locale";
import { useI18n } from "next-rosetta";
import React, { FC, FormEvent, useCallback, useRef, useState } from "react";
import { MdCheck } from "react-icons/md";
import DropdownType from "types/DropdownType";
import { logger } from "utils/logger";

import { OrderRefillForm } from "./OrderRefillForm";

type Props = {
  submitCallback: (orderRefillForm: OrderRefillForm) => void;
  locations: DropdownType[];
};

const OrderRefillComp: FC<Props> = ({ submitCallback, locations = [] }) => {
  const [localOrderRefillForm, setLocalOrderRefillForm] = useState<OrderRefillForm>({
    locationId: "",
    expectedDeliveryDate: 0,
    routeId: ""
  });

  const cancelRef = useRef();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setLoading] = useState(false);

  const { t } = useI18n<Locale>();

  const [formSubmitAttempts, setFormSubmitAttempts] = useState(0);

  const updateLocalForm = useCallback((value: unknown, key: keyof OrderRefillForm) => {
    setLocalOrderRefillForm(form => {
      (form[key] as unknown) = value;
      return form;
    });
  }, []);

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
      <Table variant="striped" colorScheme="teal">
        <TableCaption placement="top">Filling overview</TableCaption>
        <Thead>
          <Tr>
            <Th>Location</Th>
            <Th>Date</Th>
          </Tr>
        </Thead>
        <Tbody>
          {locations.map(location => {
            return (
              <Tr key={location.id}>
                <Td>{location.name}</Td>
                <Td>
                  <Button colorScheme="blue" onClick={onOpen} isLoading={isLoading}>
                    Choose date
                  </Button>
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

            <AlertDialogBody>{t("coupons.invalidate.confirm", {})}</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                {t("actions.cancel")}
              </Button>
              <Button colorScheme="red" onClick={null} ml={3}>
                {t("actions.invalidate")}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* <form onSubmit={handleSubmit}>
        <VStack align="center" justify="center">
          <FormControl
            isInvalid={
              formSubmitAttempts > 0 &&
              locations.every(b => localOrderRefillForm.locationId !== b.id)
            }
            isRequired>
            <FormLabel>Select location:</FormLabel>
            <Select
              placeholder="Select location"
              onChange={e => updateLocalForm(e.target.value, "locationId")}>
              {locations.map(location => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </Select>
            <FormErrorMessage>Please select a location</FormErrorMessage>
          </FormControl>

          <Button
            colorScheme="green"
            type="submit"
            rightIcon={<MdCheck />}
            onClick={() => setFormSubmitAttempts(x => x + 1)}>
            Submit
          </Button>
        </VStack>
      </form> */}
    </Container>
  );
};

export default OrderRefillComp;
