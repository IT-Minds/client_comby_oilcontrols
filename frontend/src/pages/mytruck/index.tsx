import {
  Badge,
  Box,
  Collapse,
  Heading,
  HStack,
  IconButton,
  Text,
  useToast,
  VStack
} from "@chakra-ui/react";
import FillOutRefillForm from "components/FillOutRefillForm/FillOutRefillForm";
import { RefillForm } from "components/FillOutRefillForm/RefillForm";
import InvalidateCouponBtn from "components/InvalidateCouponBtn/InvalidateCouponBtn";
import RunListTable from "components/RunList/RunListTable";
import { useOffline } from "hooks/useOffline";
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { I18nProps, useI18n } from "next-rosetta";
import { useCallback, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { genRefillClient } from "services/backend/apiClients";
import {
  CompleteRefillCommand,
  FuelType,
  ILocationRefillDto,
  TankState
} from "services/backend/nswagts";
import DropdownType from "types/DropdownType";
import { urlToFile } from "utils/urlToFile";

import { Locale } from "../../i18n/Locale";
import styles from "./index.module.css";

type Props = {
  //
};

const truck = {
  id: 1,
  couponNumber: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  fuelType: FuelType.OIL,
  currentTankLevel: 21
};

const LocalePage: NextPage<Props> = () => {
  const { t } = useI18n<Locale>();
  const { locale } = useRouter();

  const [refillingLocation, setRefillingLocation] = useState<ILocationRefillDto>(null);

  const { awaitCallback, isOnline } = useOffline();
  const toast = useToast();

  const formatter = Intl.NumberFormat(locale, {
    minimumFractionDigits: 2
  });

  const saveForm = useCallback(
    (reportForm: RefillForm) => {
      awaitCallback(async () => {
        const client = await genRefillClient();

        await client.complete(
          refillingLocation.refillId,
          new CompleteRefillCommand({
            couponNumber: Number(reportForm.couponId),
            actualDeliveryDate: new Date(),
            startAmount: reportForm.startliters,
            endAmount: reportForm.endliters,
            tankState: reportForm.isSpecialFill ? TankState.PARTIALLY_FILLED : TankState.FULL,
            refillNumber: 123
          })
        );

        const fileName = await client.saveCouponImage(refillingLocation.refillId, {
          data: await urlToFile(reportForm.image, "temp.webp", "image/webp"),
          fileName: "temp.webp"
        });

        toast({
          title: "Form created.",
          description: fileName,
          status: "success",
          duration: 9000,
          isClosable: true
        });
      }, Date.now().toString());

      setRefillingLocation(null);
    },
    [awaitCallback, refillingLocation]
  );

  return (
    <VStack position="relative" overflow="visible" h="95vh" w="100%">
      <Head>
        <title>
          {t("mytruck.title", {
            id: truck.id
          })}
        </title>
      </Head>
      {!isOnline && (
        <IconButton
          colorScheme="orange"
          aria-label="Offline waiting orders"
          position="absolute"
          size="sm"
          right={2}
        />
      )}
      <Heading>
        {t("mytruck.heading", {
          id: truck.id
        })}
      </Heading>

      <Box className={styles.fullWidthChildren}>
        <Collapse in={refillingLocation !== null} unmountOnExit={true}>
          <IconButton
            size="sm"
            left={1}
            top={15}
            position="absolute"
            aria-label="goback"
            onClick={() => setRefillingLocation(null)}
            icon={<MdArrowBack />}
          />
          <FillOutRefillForm
            submitCallback={saveForm}
            couponNumbers={truck.couponNumber.map<DropdownType>(x => ({
              id: x + "",
              name: x + ""
            }))}
          />
        </Collapse>

        <Collapse in={refillingLocation === null}>
          <Text fontSize="xl" textAlign="center" justifyContent="center">
            {t("mytruck.tank.current")}
            <Badge fontSize="0.8em" mb={1} colorScheme="green">
              {t("mytruck.tank.liters", {
                liters: formatter.format(truck.currentTankLevel)
              })}
            </Badge>
            {t("mytruck.tank.of")}
            <Badge fontSize="0.8em" mb={1} colorScheme="purple">
              {t("enums.fuelType." + truck.fuelType)}
            </Badge>
          </Text>
          <RunListTable
            truckId={truck.id}
            refillCb={obj => setRefillingLocation(obj)}
            fuelTypeHighlight={truck.fuelType}
          />
        </Collapse>
      </Box>

      <HStack position="absolute" bottom={4} left={0} w="100%" justifyContent="space-between">
        <InvalidateCouponBtn
          coupons={truck.couponNumber.map<DropdownType>(x => ({
            id: x + "",
            name: x + ""
          }))}
        />
        {/* <InvalidateCouponBtn
          coupon={
            new CouponDto({
              couponNumber: 2,
              status: CouponStatus.USED,
              truckId: truck.id
            })
          }
        /> */}
      </HStack>
    </VStack>
  );
};

export const getStaticProps: GetStaticProps<I18nProps<Locale>> = async context => {
  const locale = context.locale || context.defaultLocale;

  const { table = {} } = await import(`../../i18n/${locale}`);
  return { props: { table }, revalidate: 5 * 60 };
};

export default LocalePage;
