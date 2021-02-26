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
import { CouponIdDto, CouponStatus } from "services/backend/nswagts";
import { parseInputToNumber } from "utils/formatNumber";

type Props = {
  data: CouponIdDto[];
};

const InvalidateCouponBtn: FC<Props> = ({ data = [] }) => {
  const cancelRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { t } = useI18n<Locale>();

  const [dataCoupons, setDataCoupons] = useState<CouponIdDto[]>([]);
  const [chosenCoupon, setChosenCoupon] = useState<number>();

  const invalidateActions = useCallback(async () => {
    const client = await genCouponsClient();
    const result = await client.invalidateCoupon(Number(chosenCoupon));
    if (result.status === CouponStatus.DESTROYED) {
      setDataCoupons(dataCoupons.filter(a => a.id !== result.id));

      const selectedCouponIndex = dataCoupons.findIndex(d => d.couponNumber === chosenCoupon);
      const isLastIndex = dataCoupons.length - 1 === selectedCouponIndex;
      if (isLastIndex) {
        //If last index, select first coupon
        setChosenCoupon(dataCoupons[0]?.couponNumber ?? 0);
      } else {
        //If not last index, select the next coupon
        setChosenCoupon(dataCoupons[selectedCouponIndex + 1].couponNumber);
      }
    }
  }, [chosenCoupon, dataCoupons]);

  useEffect(() => {
    setDataCoupons(data);
    setChosenCoupon(data[0]?.couponNumber ?? 0);
  }, [data]);

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
              {dataCoupons.length > 0
                ? t("coupons.invalidate.confirm", { coupon: chosenCoupon })
                : t("coupons.invalidate.noMoreCoupons")}
              <Select
                onChange={e => setChosenCoupon(parseInputToNumber(e.target.value))}
                value={chosenCoupon}>
                {dataCoupons.map(coupon => (
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
                  dataCoupons.length > 0 ? invalidateActions() : onClose();
                }}
                ml={3}>
                {dataCoupons.length > 0 ? t("actions.invalidate") : t("coupons.invalidate.close")}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default InvalidateCouponBtn;
