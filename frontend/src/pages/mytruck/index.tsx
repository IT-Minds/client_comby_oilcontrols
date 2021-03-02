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
import { TOKEN_STORAGE_KEY } from "hooks/useAuth";
import { useEffectAsync } from "hooks/useEffectAsync";
import { useOffline } from "hooks/useOffline";
import { runTimeTable } from "i18n/runtimeTable";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { I18nProps, useI18n } from "next-rosetta";
import { useCallback, useState } from "react";
import { MdArrowBack } from "react-icons/md";
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
  ITruckInfoDetailsDto,
  TankState,
  TruckInfoDetailsDto,
  UserIdDto
} from "services/backend/nswagts";
import DropdownType from "types/DropdownType";
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

  const [refillingLocation, setRefillingLocation] = useState<ILocationRefillDto>(null);
  const [truckCoupons, setTruckCoupons] = useState<CouponIdDto[]>([]);

  const [truck, setTruck] = useState<ITruckInfoDetailsDto>({});

  const { awaitCallback, isOnline } = useOffline();
  const toast = useToast();

  const formatter = Intl.NumberFormat(locale, {
    minimumFractionDigits: 2
  });

  const fetchCoupons = async () => {
    const truckClient = await genTruckClient();
    const coupons = await truckClient.getTrucksCoupons(truckInfo.id);
    setTruckCoupons(coupons.results);
  };

  const completeLocationRefill = useCallback(
    (reportForm: RefillForm) => {
      awaitCallback(async () => {
        const client = await genRefillClient();

        await Promise.allSettled([
          client.complete(
            refillingLocation.refillId,
            new CompleteRefillCommand({
              couponNumber: Number(reportForm.couponNumber),
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

  useEffectAsync(async () => {
    const truck: TruckInfoDetailsDto = await getTruck(truckInfo.id);
    setTruck(truck);
  }, []);

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

      const truck: TruckInfoDetailsDto = (await getTruck(truckInfo.id)).toJSON();
      setTruck(truck);
    }, "asd");
  }, []);

  return (
    <VStack position="relative" overflow="visible" h={viewOnly ? "" : "95vh"} w="100%">
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
            submitCallback={completeLocationRefill}
            couponNumbers={truckCoupons.map<DropdownType>(x => ({
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
                truck.currentTankLevel > 4000
                  ? "green"
                  : truck.currentTankLevel > 2000
                  ? "yellow"
                  : "red"
              }>
              {t("mytruck.tank.liters", {
                liters: formatter.format(truck.currentTankLevel)
              })}
            </Badge>
          </Text>
          <RunListTable
            truckId={truckInfo.id}
            refillCb={obj => {
              fetchCoupons();
              setRefillingLocation(obj);
            }}
          />
        </Collapse>
      </Box>

      {!viewOnly && (
        <HStack position="absolute" bottom={2} right={0}>
          <RefuelForm fillData={completeTruckRefuel} />
          <InvalidateCouponBtn data={coupons} />
        </HStack>
      )}
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

  const truckInfo = await truckClient.getTruck(me.truckId).then(x => x.toJSON());
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
