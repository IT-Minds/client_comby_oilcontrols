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
  useDisclosure
} from "@chakra-ui/react";
import { Locale } from "i18n/Locale";
import { useI18n } from "next-rosetta";
import React, { FC, useCallback, useRef, useState } from "react";
import { logger } from "utils/logger";

import DatePicker from "./date-picker";
import { OrderRefill } from "./OrderRefillForm";

type Props = {
  submitCallback: (orderRefillForm: OrderRefill) => void;
  location: string;
};

const OrderRefillComp: FC<Props> = ({ submitCallback, location }) => {
  const cancelRef = useRef();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [refillDate, setRefillDate] = useState(new Date());

  const { t } = useI18n<Locale>();

  const postOrderRefill = useCallback(() => {
    logger.debug("Submitting form OrderRefillComp");
    submitCallback({
      locationId: location,
      expectedDeliveryDate: refillDate,
      routeId: "0"
    });
    onClose();
  }, [refillDate]);

  return (
    <Container>
      <Button onClick={onOpen}>Order refill</Button>

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Choose a date
            </AlertDialogHeader>

            <AlertDialogBody>
              <DatePicker
                selectedDate={refillDate}
                onChange={date => setRefillDate(date)}
                showPopperArrow={false}
              />
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                {t("actions.cancel")}
              </Button>
              <Button colorScheme="green" onClick={() => postOrderRefill()} ml={3}>
                Order refill
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
};

export default OrderRefillComp;
