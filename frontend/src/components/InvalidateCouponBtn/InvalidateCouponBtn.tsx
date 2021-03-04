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
import { TruckContext } from "contexts/TruckContext";
import { Locale } from "i18n/Locale";
import { useI18n } from "next-rosetta";
import { FC, useCallback, useContext, useEffect, useRef, useState } from "react";
import { RiFileShredLine } from "react-icons/ri";
import { genCouponsClient } from "services/backend/apiClients";
import { CouponStatus } from "services/backend/nswagts";
import { parseInputToNumber } from "utils/formatNumber";

const InvalidateCouponBtn: FC = () => {
  const cancelRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useI18n<Locale>();

  const { coupons, reloadData } = useContext(TruckContext);

  const [chosenCoupon, setChosenCoupon] = useState<number>();

  const invalidateActions = useCallback(async () => {
    const client = await genCouponsClient();
    const result = await client.invalidateCoupon(Number(chosenCoupon));
    if (result.status === CouponStatus.DESTROYED) {
      const selectedCouponIndex = coupons.findIndex(d => d.couponNumber === chosenCoupon);
      const isLastIndex = coupons.length - 1 === selectedCouponIndex;
      if (isLastIndex) {
        setChosenCoupon(coupons[0]?.couponNumber ?? null);
      } else {
        //If not last index, select the next coupon
        setChosenCoupon(coupons[selectedCouponIndex + 1].couponNumber);
      }

      reloadData();
    }
  }, [chosenCoupon, coupons]);

  useEffect(() => {
    setChosenCoupon(coupons[0]?.couponNumber ?? null);
  }, [coupons]);

  return (
    <>
      <Button colorScheme="red" onClick={onOpen} leftIcon={<RiFileShredLine />}>
        {t("coupons.invalidate.invalidate")}
      </Button>

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {t("coupons.invalidate.invalidate")}
            </AlertDialogHeader>

            <AlertDialogBody>
              {coupons.length > 0
                ? t("coupons.invalidate.confirm", { coupon: chosenCoupon })
                : t("coupons.invalidate.noMoreCoupons")}
              <Select
                onChange={e => setChosenCoupon(parseInputToNumber(e.target.value))}
                value={chosenCoupon}>
                {coupons.map(coupon => (
                  <option key={coupon.couponNumber} value={coupon.couponNumber}>
                    {coupon.couponNumber}
                  </option>
                ))}
              </Select>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button variant="outline" ref={cancelRef} onClick={onClose}>
                {t("actions.cancel")}
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  coupons.length > 0 ? invalidateActions() : onClose();
                }}
                ml={3}>
                {coupons.length > 0 ? t("actions.invalidate") : t("coupons.invalidate.close")}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default InvalidateCouponBtn;
