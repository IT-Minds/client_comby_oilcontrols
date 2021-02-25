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
import DropdownType from "types/DropdownType";

type Props = {
  data: CouponIdDto[];
  coupons: DropdownType[];
};

const InvalidateCouponBtn: FC<Props> = ({ data = [], coupons }) => {
  const cancelRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { t } = useI18n<Locale>();

  const [dataCoupons, setDataCoupons] = useState<CouponIdDto[]>([]);
  const [chosenCoupon, setChosenCoupon] = useState(coupons[0]?.name ?? "0");

  const invalidateActions = useCallback(async () => {
    const client = await genCouponsClient();
    const result = await client.invalidateCoupon(Number(chosenCoupon));
    if (result.status === CouponStatus.DESTROYED) {
      setDataCoupons(dataCoupons.filter(a => a.id !== result.id));
      setChosenCoupon(coupons[0]?.name ?? "0");
    }
  }, [chosenCoupon, dataCoupons]);

  useEffect(() => {
    setDataCoupons(data);
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
              {t("coupons.invalidate.confirm", { coupon: chosenCoupon })}
              <Select onChange={e => setChosenCoupon(e.target.value)}>
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
