import { Badge, Box, Heading, HStack, IconButton, Text, useToast, VStack } from "@chakra-ui/react";
import RefuelForm from "components/CarInfo/Filling/RefuelForm";
import { TruckRefuelForm } from "components/CarInfo/Filling/TruckRefuelForm";
import { RefillForm } from "components/FillOutRefillForm/RefillForm";
import InvalidateCouponBtn from "components/InvalidateCouponBtn/InvalidateCouponBtn";
import RunListTable from "components/RunList/RunListTable";
import { TruckContext } from "contexts/TruckContext";
import { TOKEN_STORAGE_KEY } from "hooks/useAuth";
import { useEffectAsync } from "hooks/useEffectAsync";
import { useOffline } from "hooks/useOffline";
import { runTimeTable } from "i18n/runtimeTable";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { I18nProps, useI18n } from "next-rosetta";
import { useCallback, useState } from "react";
import {
  genAuthenticationClient,
  genRefillClient,
  genTruckClient
} from "services/backend/apiClients";
import {
  CompleteRefillCommand,
  CouponIdDto,
  CreateTruckRefillCommand,
  ILocationRefillDto,
  TankState,
  TruckInfoDetailsDto,
  UserIdDto
} from "services/backend/nswagts";
import { urlToFile } from "utils/urlToFile";

import { Locale } from "../../i18n/Locale";
import styles from "./index.module.css";

type Props = {
  truckInfo: TruckInfoDetailsDto;
  coupons: CouponIdDto[];
  viewOnly?: boolean;
};

const getTruck = async (id: number): Promise<TruckInfoDetailsDto> => {
  const client = await genTruckClient();
  return await client.getTruck(id);
};

const MyTruck: NextPage<Props> = ({ truckInfo, coupons, viewOnly = false }) => {
  const { t } = useI18n<Locale>();
  const { locale } = useRouter();
  const formatter = Intl.NumberFormat(locale, {
    minimumFractionDigits: 2
  });

  const [refills, setRefills] = useState<ILocationRefillDto[]>([]);
  const [truckCoupons, setTruckCoupons] = useState<CouponIdDto[]>(coupons);

  const { awaitCallback, isOnline } = useOffline();
  const toast = useToast();

  useEffectAsync(async () => {
    const client = await genTruckClient();
    client.setCacheableResponse();
    const refills = await client.getTrucksRefills(truckInfo.id).then(
      x => x ?? [],
      () => []
    );
    setRefills(refills);

    const coupons = await client.getTrucksCoupons(truckInfo.id);
    setTruckCoupons(coupons.results);
  }, [truckInfo]);

  const completeLocationRefill = useCallback(
    (reportForm: RefillForm, refillingLocation: ILocationRefillDto) => {
      awaitCallback(async () => {
        const client = await genRefillClient();

        try {
          await client.complete(
            refillingLocation.refillId,
            new CompleteRefillCommand({
              couponNumber: Number(reportForm.couponNumber),
              actualDeliveryDate: new Date(),
              startAmount: reportForm.startliters,
              endAmount: reportForm.endliters,
              tankState: reportForm.isSpecialFill ? TankState.PARTIALLY_FILLED : TankState.FULL
            })
          );
          if (reportForm.image) {
            await client.saveCouponImage(refillingLocation.refillId, {
              data: await urlToFile(reportForm.image, "temp.webp", "image/webp"),
              fileName: "temp.webp"
            });
          }
          toast({
            title: t("toast.locationRefill"),
            description: t("toast.successful"),
            status: "success",
            duration: 9000,
            isClosable: true
          });
        } catch (err) {
          toast({
            title: t("toast.locationRefill"),
            description: t("toast.error"),
            status: "error",
            duration: 9000,
            isClosable: true
          });
        }
      }, Date.now().toString());
    },
    [awaitCallback]
  );

  const completeTruckRefuel = useCallback((form: TruckRefuelForm) => {
    awaitCallback(async () => {
      const client = await genTruckClient();
      await client.createTruckRefuel(
        truckInfo.id,
        new CreateTruckRefillCommand({
          amount: form.fillAmount,
          fuelCardNumber: form.cardNumber,
          fuelType: form.fuelType,
          timeStamp: form.date
        })
      );

      const truck: TruckInfoDetailsDto = await getTruck(truckInfo.id).then(x => x.toJSON());
      truckInfo = truck;
    }, "refuel");
  }, []);

  return (
    <VStack position="relative" overflow="visible" h={viewOnly ? "" : "95vh"} w="100%">
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

      <TruckContext.Provider
        value={{
          truck: truckInfo,
          coupons: truckCoupons,
          refills,
          completeLocationRefill,
          completeTruckRefuel
        }}>
        <Box className={styles.fullWidthChildren}>
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
          <RunListTable />
        </Box>

        {!viewOnly && (
          <HStack position="absolute" bottom={2} right={0}>
            <RefuelForm fillData={completeTruckRefuel} />
            <InvalidateCouponBtn data={coupons} />
          </HStack>
        )}
      </TruckContext.Provider>
    </VStack>
  );
};

// export const getStaticProps: GetStaticProps<I18nProps<Locale> & Props> = async context => {
export const getServerSideProps: GetServerSideProps<Props & I18nProps<Locale>> = async context => {
  const locale = context.locale || context.defaultLocale;

  const token = context.req.cookies[TOKEN_STORAGE_KEY];

  if (!token) {
    context.res.statusCode = 302;
    context.res.setHeader("Location", "/");
    return { props: {} as any };
  }
  process.env.AUTH_TOKEN = token;

  const auth = await genAuthenticationClient();
  const me: UserIdDto = await auth.checkAuth().catch(() => null);

  if (!me?.truckId) {
    context.res.statusCode = 302;
    context.res.setHeader("Location", "/");
    return { props: {} as any };
  }

  const truckClient = await genTruckClient();

  const truckInfo = (await getTruck(me.truckId)).toJSON(); // await truckClient.getTruck(me.truckId).then(x => x.toJSON());
  const coupons = await truckClient.getTrucksCoupons(me.truckId).then(
    x => x.results.map(y => y.toJSON()),
    () => []
  );

  let { table = {} } = await import(`../../i18n/${locale}`);
  table = runTimeTable(locale, table);

  // return { props: { table, truckInfo, coupons }, revalidate: 5 };
  return { props: { table, truckInfo, coupons } };
};

export default MyTruck;
