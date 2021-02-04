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
import AddTruckTriggerBtn from "components/TruckMetaData/AddTruckTriggerBtn";
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
  const [truckEntities, setTruckEntities] = useState<TruckInfoIdDto[]>(null);

  // For modal >>>
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [truckId, setTruckId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [truckMetaData, setTruckMetaData] = useState<TruckInfoIdDto>(null);
  const [couponData, setCouponData] = useState<CouponDto[]>(null);
  const [truckRefillData, setTruckRefillData] = useState<LocationRefillDto[]>(null);
  // <<<

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
    const client = await genTruckClient();

    if (truckId) {
      onOpen();
      setIsLoading(true);

      const couponsData = await client.getTrucksCoupons(truckId);
      const truckMetaData = await client.getTruck(truckId);
      const truckRefillData = await client.getTrucksRefills(truckId);

      setCouponData(couponsData.results);
      setTruckMetaData(truckMetaData);
      setTruckRefillData(truckRefillData);

      setIsLoading(false);
    } else {
      const truckEntityData = await client.getTrucks();
      setTruckEntities(truckEntityData.results);
    }
  }, [truckId]);

  return (
    <VStack h="95vh" w="100%">
      <Heading>Truck Overview</Heading>
      <AddTruckTriggerBtn />
      <TruckListComp preLoadedData={truckEntities} truckId={setTruckId} />

      {/* // TODO move modal into own component */}
      <Modal
        size="4xl"
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
            <Heading size="sm">Meta data</Heading>
            <AddTruckMetaData
              submitCallback={x => saveMetaDataForm(x)}
              truckMetaData={truckMetaData}
            />

            <Heading size="sm" mt={8}>
              Coupons
            </Heading>
            <AddCouponComp
              submitCallback={x => {
                saveCoupons(x);
              }}
              coupons={couponData}
            />

            <Heading size="sm" mt={8}>
              Fueling history
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

  const { table = {} } = await import(`../i18n/${locale}`);

  return {
    props: {
      table
    }
  };
};

export default TruckPage;