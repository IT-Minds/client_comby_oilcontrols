import {
  Badge,
  Box,
  Collapse,
  Container,
  Flex,
  Heading,
  HStack,
  IconButton,
  Text,
  VStack
} from "@chakra-ui/react";
import FillOutRefillForm from "components/FillOutRefillForm/FillOutRefillForm";
import InvalidateCouponBtn from "components/InvalidateCouponBtn/InvalidateCouponBtn";
import RunListTable from "components/RunList/RunListTable";
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { I18nProps, useI18n } from "next-rosetta";
import { useRef, useState } from "react";
import { MdArrowBack, MdPrint } from "react-icons/md";
import { useReactToPrint } from "react-to-print";
import { CouponDto, CouponStatus } from "services/backend/nswagts";

import { Locale } from "../../i18n/Locale";
import styles from "./index.module.css";

type Props = {
  //
};

const TruckId = 1;

const LocalePage: NextPage<Props> = () => {
  const { t } = useI18n<Locale>();
  const componentRef = useRef<HTMLDivElement>();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  });

  const [refillingLocation, setRefillingLocation] = useState(0);

  return (
    <VStack position="relative" overflow="visible" h="95vh" w="100%">
      <Head>
        <title>
          {t("mytruck.title", {
            id: TruckId
          })}
        </title>
      </Head>
      <Heading>
        {t("mytruck.heading", {
          id: TruckId
        })}
      </Heading>

      <Box className={styles.fullWidthChildren}>
        <Collapse in={refillingLocation > 0} unmountOnExit={true}>
          <IconButton
            size="sm"
            left={1}
            top={15}
            position="absolute"
            aria-label="goback"
            onClick={() => setRefillingLocation(0)}
            icon={<MdArrowBack />}
          />
          <FillOutRefillForm submitCallback={x => alert(JSON.stringify(x, null, 2))} />
        </Collapse>

        <Collapse in={refillingLocation === 0}>
          <Text fontSize="xl" textAlign="center" justifyContent="center">
            Current Tank{" "}
            <Badge fontSize="0.8em" mb={1} colorScheme="green">
              20.00 liters
            </Badge>{" "}
            of{" "}
            <Badge fontSize="0.8em" mb={1} colorScheme="purple">
              Oil
            </Badge>
            <IconButton
              float="right"
              colorScheme="blue"
              aria-label="Print Table Button"
              onClick={() => {
                handlePrint();
              }}
              icon={<MdPrint />}
            />
          </Text>
          <RunListTable
            truckId={TruckId}
            ref={componentRef}
            refillCb={obj => setRefillingLocation(obj.locationId)}
          />
        </Collapse>
      </Box>

      <HStack position="absolute" bottom={4} left={0} w="100%" justifyContent="space-between">
        <InvalidateCouponBtn
          coupon={
            new CouponDto({
              couponNumber: 2,
              status: CouponStatus.USED,
              truckId: TruckId
            })
          }
        />
        <InvalidateCouponBtn
          coupon={
            new CouponDto({
              couponNumber: 2,
              status: CouponStatus.USED,
              truckId: TruckId
            })
          }
        />
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
