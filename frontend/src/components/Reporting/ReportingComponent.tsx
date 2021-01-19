import {
  Button,
  Checkbox,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Image,
  Input,
  InputGroup,
  InputRightAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import CameraComp from "components/Camera/CameraComponent";
import React, { FC, FormEvent, useCallback, useState } from "react";
import { MdCheck, MdPhotoCamera, MdRemoveRedEye, MdRepeat } from "react-icons/md";
import { enumConvertor } from "services/backend/ext/enumConvertor";
import { FuelType } from "services/backend/nswagts";
import DropdownType from "types/DropdownType";
import { capitalize } from "utils/capitalizeAnyString";
import { formatInputNumber, parseInputToNumber } from "utils/formatNumber";
import { logger } from "utils/logger";

import { ReportForm } from "./ReportForm";

type Props = {
  submitCallback: (reportForm: ReportForm) => void;
  carId: string;
  locations?: DropdownType[];
  couponNumbers?: DropdownType[];
};

const ReportingComp: FC<Props> = ({
  submitCallback,
  carId,
  locations = [],
  couponNumbers = []
}) => {
  const [localReportForm, setLocalReportForm] = useState<ReportForm>({
    carId,
    liters: 0,
    fuelType: null,
    couponId: couponNumbers[0]?.id ?? "",
    locationId: "",
    isSpecialFill: false,
    image: ""
  });

  const [isTakingPic, setIsTakingPic] = useState(false);
  const [formSubmitAttempts, setFormSubmitAttempts] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const updateLocalForm = useCallback((value: unknown, key: keyof ReportForm) => {
    setLocalReportForm(form => {
      (form[key] as unknown) = value;
      return form;
    });
  }, []);

  const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    logger.debug("Submitting form ReportingComp");
    submitCallback(localReportForm);
    setFormSubmitAttempts(0);
  }, []);

  return (
    <Container>
      {isTakingPic && (
        <CameraComp
          imgSource={screenshot => {
            updateLocalForm(screenshot, "image");
            setIsTakingPic(false);
          }}
        />
      )}
      <form onSubmit={handleSubmit} hidden={isTakingPic}>
        <VStack spacing={2}>
          <FormControl id="car-id" isReadOnly>
            <FormLabel>Car id:</FormLabel>
            <Input type="text" value={carId} />
          </FormControl>

          <FormControl
            id="location-no"
            isInvalid={
              formSubmitAttempts > 0 && locations.every(l => localReportForm.locationId !== l.id)
            }
            isRequired>
            <FormLabel>Select location:</FormLabel>
            <Select
              placeholder="Select location"
              onChange={e => updateLocalForm(e.target.value, "locationId")}>
              {locations.map(location => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </Select>
            <FormErrorMessage>Please select one of the allowed locations</FormErrorMessage>
          </FormControl>

          <FormControl
            id="coupon-no"
            isInvalid={
              formSubmitAttempts > 0 &&
              couponNumbers.every(cn => localReportForm.couponId !== cn.id)
            }
            isRequired>
            <FormLabel>Select coupon number:</FormLabel>
            <Select onChange={e => updateLocalForm(e.target.value, "couponId")}>
              {couponNumbers.map(path => (
                <option key={path.id} value={path.id}>
                  {path.name}
                </option>
              ))}
            </Select>
            <FormErrorMessage>Please select one of the allowed coupons</FormErrorMessage>
          </FormControl>

          <FormControl
            isInvalid={
              formSubmitAttempts > 0 &&
              Object.values(enumConvertor<number>(FuelType)).every(
                key => localReportForm.fuelType !== (FuelType[key] as unknown)
              )
            }
            isRequired>
            <FormLabel id="fuel-type">Select fuel type:</FormLabel>
            <Select
              onChange={e => updateLocalForm(FuelType[Number(e.target.value)], "fuelType")}
              placeholder="Select option">
              {Object.entries(enumConvertor<number>(FuelType)).map(([a, b]) => (
                <option key={b} value={b}>
                  {capitalize(a)}
                </option>
              ))}
            </Select>
            <FormErrorMessage>Please select one of the allowed fuel types</FormErrorMessage>
          </FormControl>

          <FormControl
            id="liters"
            isInvalid={formSubmitAttempts > 0 && isNaN(localReportForm.liters)}
            isRequired>
            <FormLabel>Amount filled:</FormLabel>

            <InputGroup>
              <Input
                placeholder="Enter amount filled into tank"
                onChange={e =>
                  updateLocalForm(parseInputToNumber(formatInputNumber(e.target.value)), "liters")
                }
                minW="50%"></Input>
              <InputRightAddon>liters</InputRightAddon>
            </InputGroup>
            <FormErrorMessage>
              Please enter a valid amount of liters filled into the tank
            </FormErrorMessage>
          </FormControl>

          <FormControl id="partial">
            <HStack>
              <FormLabel mb={4}>Is partial fill:</FormLabel>
              <Checkbox
                mb={4}
                onChange={e => updateLocalForm(e.target.checked, "isSpecialFill")}></Checkbox>
            </HStack>
          </FormControl>

          <FormControl
            id="photo"
            isInvalid={formSubmitAttempts > 0 && localReportForm.image.length <= 0}
            isRequired>
            <HStack>
              {localReportForm.image.length > 0 ? (
                <Button onClick={onOpen} rightIcon={<MdRemoveRedEye />}>
                  View Image
                </Button>
              ) : (
                <Button
                  colorScheme="blue"
                  rightIcon={<MdPhotoCamera />}
                  onClick={() => setIsTakingPic(true)}>
                  Take Image
                </Button>
              )}
              <Input hidden value={localReportForm.image} onChange={() => null} />
              <FormErrorMessage>An image is needed</FormErrorMessage>
            </HStack>
          </FormControl>

          <Button
            colorScheme="green"
            type="submit"
            rightIcon={<MdCheck />}
            onClick={() => setFormSubmitAttempts(x => x + 1)}>
            Submit
          </Button>
        </VStack>
      </form>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Image</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image src={localReportForm.image} />
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="yellow"
              rightIcon={<MdRepeat />}
              onClick={() => {
                updateLocalForm("", "image");
                setIsTakingPic(true);
                onClose();
              }}>
              Retake Image
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default ReportingComp;
