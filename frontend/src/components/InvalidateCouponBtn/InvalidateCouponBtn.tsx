import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Select,
  useDisclosure
} from "@chakra-ui/react";
import { Locale } from "i18n/Locale";
import { useI18n } from "next-rosetta";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { RiFileShredLine } from "react-icons/ri";
import { genCouponsClient } from "services/backend/apiClients";
import DropdownType from "types/DropdownType";

type Props = {
  coupons: DropdownType[];
  triggered?: boolean;
};

const InvalidateCouponBtn: FC<Props> = ({ coupons, triggered = false }) => {
  const cancelRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { t } = useI18n<Locale>();

  const [chosenCoupon, setChosenCoupon] = useState(coupons[0]?.id ?? "0");
  const invalidateActions = useCallback(async () => {
    onClose();
    const client = await genCouponsClient();
    await client.invalidateCoupon(Number.parseInt(chosenCoupon));
  }, [chosenCoupon]);

  useEffect(() => {
    if (triggered) {
      onOpen();
    } else {
      onClose();
    }
  }, [triggered]);

  return (
    <>
      <Button
        colorScheme="red"
        onClick={onOpen}
        leftIcon={<RiFileShredLine />}
        // leftIcon={<GiGasPump />}>
      >
        {t("coupons.invalidate.invalidate")}
      </Button>

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {t("coupons.invalidate.invalidate")}
            </AlertDialogHeader>

            <AlertDialogBody>
              {t("coupons.invalidate.confirm", { coupon: chosenCoupon })}
              <Select onChange={e => setChosenCoupon(e.target.value)}>
                {coupons.map(coupon => (
                  <option key={coupon.id} value={coupon.id}>
                    {coupon.name}
                  </option>
                ))}
              </Select>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button variant="outline" ref={cancelRef} onClick={onClose}>
                {t("actions.cancel")}
              </Button>
              <Button colorScheme="red" onClick={invalidateActions} ml={3}>
                {t("actions.invalidate")}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default InvalidateCouponBtn;
