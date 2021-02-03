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
import RefuelForm from "components/CarInfo/Filling/RefuelForm";
import { TruckRefuelForm } from "components/CarInfo/Filling/TruckRefuelForm";
import FillOutRefillForm from "components/FillOutRefillForm/FillOutRefillForm";
import { RefillForm } from "components/FillOutRefillForm/RefillForm";
import InvalidateCouponBtn from "components/InvalidateCouponBtn/InvalidateCouponBtn";
import RunListTable from "components/RunList/RunListTable";
import { useOffline } from "hooks/useOffline";
import { GetServerSideProps, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { I18nProps, useI18n } from "next-rosetta";
import { useCallback, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { genRefillClient, genTruckClient } from "services/backend/apiClients";
import {
  CompleteRefillCommand,
  CouponIdDto,
  CreateTruckRefillCommand,
  ILocationRefillDto,
  TankState,
  TruckInfoDetailsDto
} from "services/backend/nswagts";
import DropdownType from "types/DropdownType";
import { urlToFile } from "utils/urlToFile";

import { Locale } from "../../i18n/Locale";
import styles from "./index.module.css";

type Props = {
  truckInfo: TruckInfoDetailsDto;
  coupons: CouponIdDto[];
};

const LocalePage: NextPage<Props> = ({ truckInfo, coupons }) => {
  const { t } = useI18n<Locale>();
  const { locale } = useRouter();

  const [refillingLocation, setRefillingLocation] = useState<ILocationRefillDto>(null);

  const { awaitCallback, isOnline } = useOffline();
  const toast = useToast();

  const formatter = Intl.NumberFormat(locale, {
    minimumFractionDigits: 2
  });

  const completeLocationRefill = useCallback(
    (reportForm: RefillForm) => {
      awaitCallback(async () => {
        const client = await genRefillClient();

        await Promise.allSettled([
          client.complete(
            refillingLocation.refillId,
            new CompleteRefillCommand({
              couponNumber: Number(reportForm.couponId),
              actualDeliveryDate: new Date(),
              startAmount: reportForm.startliters,
              endAmount: reportForm.endliters,
              tankState: reportForm.isSpecialFill ? TankState.PARTIALLY_FILLED : TankState.FULL
            })
          ),

          client.saveCouponImage(refillingLocation.refillId, {
            data: await urlToFile(reportForm.image, "temp.webp", "image/webp"),
            fileName: "temp.webp"
          })
        ]);

        toast({
          title: "Location refill completed",
          description: "Your location has been filled",
          status: "success",
          duration: 9000,
          isClosable: true
        });
      }, Date.now().toString());

      setRefillingLocation(null);
    },
    [awaitCallback, refillingLocation]
  );

  const completeTruckRefuel = useCallback((form: TruckRefuelForm) => {
    awaitCallback(async () => {
      const client = await genTruckClient();
      const result = await client.createTruckRefuel(
        truckInfo.id,
        new CreateTruckRefillCommand({
          amount: form.fillAmount,
          fuelCardNumber: form.cardNumber,
          fuelType: form.fuelType,
          timeStamp: form.date
        })
      );

      console.log(result);
    }, "asd");
  }, []);

  return (
    <VStack position="relative" overflow="visible" h="95vh" w="100%">
      <Head>
        <title>
          {t("mytruck.title", {
            id: truckInfo.id
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
          id: truckInfo.id
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
            submitCallback={completeLocationRefill}
            couponNumbers={coupons.map<DropdownType>(x => ({
              id: x.id + "",
              name: x.couponNumber + ""
            }))}
          />
        </Collapse>

        <Collapse in={refillingLocation === null}>
          <Text fontSize="xl" textAlign="center" justifyContent="center">
            {t("mytruck.tank.current")}
            <Badge
              fontSize="0.8em"
              mb={1}
              colorScheme={
                truckInfo.currentTankLevel > 4000
                  ? "green"
                  : truckInfo.currentTankLevel > 2000
                  ? "yellow"
                  : "red"
              }>
              {t("mytruck.tank.liters", {
                liters: formatter.format(truckInfo.currentTankLevel)
              })}
            </Badge>
          </Text>
          <RunListTable truckId={truckInfo.id} refillCb={obj => setRefillingLocation(obj)} />
        </Collapse>
      </Box>

      <HStack position="absolute" bottom={2} right={0}>
        <RefuelForm fillData={completeTruckRefuel} />
        <InvalidateCouponBtn
          coupons={coupons.map<DropdownType>(x => ({
            id: x.id + "",
            name: x.couponNumber + ""
          }))}
        />
      </HStack>
    </VStack>
  );
};

// export const getStaticProps: GetStaticProps<I18nProps<Locale> & Props> = async context => {
export const getServerSideProps: GetServerSideProps<Props & I18nProps<Locale>> = async context => {
  const locale = context.locale || context.defaultLocale;

  const id = Number.parseInt(context.query.id as string);

  const truckClient = await genTruckClient();

  const truckInfo = await truckClient.getTruck(id).then(x => x.toJSON());
  const coupons = await truckClient.getTrucksCoupons(id).then(
    x => x.results.map(y => y.toJSON()),
    () => []
  );

  const { table = {} } = await import(`../../i18n/${locale}`);

  // return { props: { table, truckInfo, coupons }, revalidate: 5 };
  return { props: { table, truckInfo, coupons } };
};

export default LocalePage;