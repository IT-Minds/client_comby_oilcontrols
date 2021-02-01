import {
  Box,
  Button,
  Center,
  Container,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useColorModeValue,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import AddCouponComp from "components/CouponManagement/AddCoupon/AddCouponComp";
import { AddCouponForm } from "components/CouponManagement/AddCoupon/AddCouponForm";
import FillingOverviewComp from "components/FillingOverview/FillingOverviewComp";
import TruckListComp from "components/TruckList/TruckListComp";
import AddTruckMetaData from "components/TruckMetaData/AddTruckMetaData";
import { useEffectAsync } from "hooks/useEffectAsync";
import { useOffline } from "hooks/useOffline";
import { Locale } from "i18n/Locale";
import { GetStaticProps, NextPage } from "next";
import { I18nProps } from "next-rosetta";
import React, { useCallback, useState } from "react";
import { genCouponsClient, genTruckClient } from "services/backend/apiClients";
import {
  AssignCouponsCommand,
  CouponDto,
  CreateTruckCommand,
  TruckInfoIdDto,
  UpdateTruckCommand
} from "services/backend/nswagts";

type Props = {
  trucksEntities: TruckInfoIdDto[];
  needle: string;
  hasMore: boolean;
  pageCount: number;
};

const TruckPage: NextPage<Props> = ({ trucksEntities, needle, hasMore, pageCount }) => {
  const bg = useColorModeValue("gray.100", "gray.700");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [truckId, setTruckId] = useState(null);
  const [truckMetaData, setTruckMetaData] = useState<TruckInfoIdDto>(null);
  const [couponData, setCouponData] = useState<CouponDto[]>(null);

  const { awaitCallback } = useOffline();
  const toast = useToast();

  const saveCoupons = useCallback(
    async (couponNumbers: number[]) => {
      awaitCallback(async () => {
        const client = await genCouponsClient();
        await client.create(
         new AssignCouponsCommand({
            truckId,
            couponNumbers
          })
            );
        toast({
          title: "Coupons Saved",
          description: "Successful",
          status: "success",
          duration: 9000,
          isClosable: true
        });
      }, Date.now().toString());
    },
    [awaitCallback, truckId]
  );


  const saveMetaDataForm = useCallback(
    async metaDataForm => {
      awaitCallback(async () => {
        const client = await genTruckClient();
        await (metaDataForm.id
          ? client.updateTruck(
              metaDataForm.id,
              new UpdateTruckCommand({
                truckInfo: metaDataForm
              })
            )
          : client.createTruck(
              new CreateTruckCommand({
                truckInfo: metaDataForm
              })
            ));

        toast({
          title: "Truck Meta Data Saved",
          description: "Successful",
          status: "success",
          duration: 9000,
          isClosable: true
        });
      }, Date.now().toString());
    },
    [awaitCallback]
  );

  useEffectAsync(async () => {
    if (truckId) {
      onOpen();
      setIsLoading(true);

      const truckMetaClient = await genTruckClient();
      const couponsData = await truckMetaClient.getTrucksCoupons(truckId);
      setCouponData(couponsData.results);

      const truckMetaData = await truckMetaClient.getTruck(truckId);
      setTruckMetaData(truckMetaData);

      setIsLoading(false);
    }
  }, [truckId]);

  return (
    <Container maxW="xl" centerContent>
      <Box padding="4" bg={bg} maxW="6xl" maxH="4xl" resize="both" overflow="auto">
        <TruckListComp
          preLoadedData={trucksEntities}
          preloadDataNeedle={needle}
          preloadLoadedAll={!hasMore}
          preLoadedPageCount={pageCount}
          truckId={id => {
            setTruckId(id);
          }}
        />
      </Box>

      <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Overview of Truck {truckId}</ModalHeader>
          <ModalCloseButton />
          <Center>
            <Spinner
              hidden={!isLoading}
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          </Center>
          <ModalBody hidden={isLoading}>
            <Heading size="sm">Coupons</Heading>
            <AddCouponComp
              submitCallback={x => {
                saveCoupons(x);
              }}
              coupons={couponData}></AddCouponComp>

            <Heading size="sm" mt={8}>
              Filling overview
            </Heading>
            <FillingOverviewComp
              preLoadedData={[]}
              preloadDataNeedle={needle}
              preloadLoadedAll={!hasMore}
              preLoadedPageCount={pageCount}
            />

            <Heading size="sm" mt={8}>
              Meta data
            </Heading>
            <AddTruckMetaData
              submitCallback={x => saveMetaDataForm(x)}
              truckMetaData={truckMetaData}></AddTruckMetaData>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={() => {
                onClose();
                setTruckId(null);
              }}>
              Ok
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export const getStaticProps: GetStaticProps<I18nProps<Locale>> = async context => {
  const locale = context.locale || context.defaultLocale;

  const { table = {} } = await import(`../../i18n/${locale}`);

  const data = await genTruckClient().then(client => client.getTrucks(0));

  return {
    props: {
      table,
      // !This is a hack to get around undefined values in dataset
      trucksEntities: JSON.parse(JSON.stringify(data.results)),
      needle: data.newNeedle ?? "0",
      hasMore: data.hasMore,
      pageCount: data.pagesRemaining + 1
    },
    revalidate: 60
  };
};

export default TruckPage;
