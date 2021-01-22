import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure
} from "@chakra-ui/react";
import { Locale } from "i18n/Locale";
import { useI18n } from "next-rosetta";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { genCouponsClient } from "services/backend/apiClients";
import { CouponDto } from "services/backend/nswagts";

type Props = {
  coupon: CouponDto;
  triggered?: boolean;
};

const InvalidateCouponBtn: FC<Props> = ({ coupon, triggered = false }) => {
  const cancelRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { t } = useI18n<Locale>();

  const [isLoading, setLoading] = useState(false);
  const invalidateActions = useCallback(async () => {
    setLoading(true);
    onClose();
    const client = await genCouponsClient();
    await client.invalidateCoupon(coupon.couponNumber);

    setLoading(false);
  }, []);

  useEffect(() => {
    if (triggered) {
      onOpen();
    } else {
      onClose();
    }
  }, [triggered]);

  return (
    <>
      <Button colorScheme="red" onClick={onOpen} isLoading={isLoading}>
        {t("coupons.invalidate.invalidate")}
      </Button>

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {t("coupons.invalidate.invalidate")}
            </AlertDialogHeader>

            <AlertDialogBody>
              {t("coupons.invalidate.confirm", { coupon: coupon.couponNumber })}
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
