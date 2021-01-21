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
import { IOrderRefillCommand } from "services/backend/nswagts";
import { logger } from "utils/logger";

import DatePicker from "./date-picker";

type Props = {
  submitCallback: (orderRefillForm: IOrderRefillCommand) => void;
  locationId: number;
};

const OrderRefillComp: FC<Props> = ({ submitCallback, locationId }) => {
  const cancelRef = useRef();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [refillDate, setRefillDate] = useState(new Date());

  const { t } = useI18n<Locale>();

  const postOrderRefill = useCallback(() => {
    logger.debug("Submitting form OrderRefillComp");
    submitCallback({
      locationId,
      expectedDeliveryDate: refillDate,
      routeId: 0
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
