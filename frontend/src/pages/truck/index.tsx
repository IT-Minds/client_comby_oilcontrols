import {
  Center,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
  VStack
} from "@chakra-ui/react";
import AddCouponComp from "components/CouponManagement/AddCoupon/AddCouponComp";
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
  LocationRefillDto,
  TruckInfoIdDto,
  UpdateTruckCommand
} from "services/backend/nswagts";

const TruckPage: NextPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [truckId, setTruckId] = useState(null);
  const [truckMetaData, setTruckMetaData] = useState<TruckInfoIdDto>(null);
  const [couponData, setCouponData] = useState<CouponDto[]>(null);
  const [truckRefillData, setTruckRefillData] = useState<LocationRefillDto[]>(null);
  const [truckEntities, setTruckEntities] = useState<TruckInfoIdDto[]>(null);

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
    const truckEntityData = await genTruckClient().then(client => client.getTrucks(0));
    setTruckEntities(truckEntityData.results);

    if (truckId) {
      onOpen();
      setIsLoading(true);

      const truckMetaClient = await genTruckClient();
      const couponsData = await truckMetaClient.getTrucksCoupons(truckId);
      setCouponData(couponsData.results);

      const truckMetaData = await truckMetaClient.getTruck(truckId);
      setTruckMetaData(truckMetaData);

      const truckRefillData = await truckMetaClient.getTrucksRefills(truckId);
      setTruckRefillData(truckRefillData);

      setIsLoading(false);
    }
  }, [truckId]);

  return (
    <VStack position="relative" overflow="visible" h="95vh" w="100%">
      <Heading>Truck Overview</Heading>

      <TruckListComp
        preLoadedData={truckEntities}
        truckId={id => {
          setTruckId(id);
        }}
      />

      <Modal
        size="5xl"
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setTruckId(null);
        }}>
        <ModalOverlay />
        <ModalContent height="90vh">
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
          <ModalBody hidden={isLoading} overflowY="auto">
            <Heading size="sm">Coupons</Heading>
            <AddCouponComp
              submitCallback={x => {
                saveCoupons(x);
              }}
              coupons={couponData}></AddCouponComp>

            <Heading size="sm" mt={8}>
              Meta data
            </Heading>
            <AddTruckMetaData
              submitCallback={x => saveMetaDataForm(x)}
              truckMetaData={truckMetaData}></AddTruckMetaData>

            <Heading size="sm" mt={8}>
              Filling overview
            </Heading>
            <FillingOverviewComp preLoadedData={truckRefillData} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export const getStaticProps: GetStaticProps<I18nProps<Locale>> = async context => {
  const locale = context.locale || context.defaultLocale;

  const { table = {} } = await import(`../../i18n/${locale}`);

  return {
    props: {
      table
    },
    revalidate: 60
  };
};

export default TruckPage;
