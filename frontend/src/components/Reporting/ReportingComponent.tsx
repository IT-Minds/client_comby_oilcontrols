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
import { IoMdCamera, IoMdEye, IoMdRepeat } from "react-icons/io";
import { MdCheck } from "react-icons/md";
import DropdownType from "types/DropdownType";
import { logger } from "utils/logger";

import { ReportForm } from "./ReportForm";

type Props = {
  submitCallback: (reportForm: ReportForm) => void;
  carId: string;
  locations?: DropdownType[];
  couponNumbers?: DropdownType[];
  fillTypes?: DropdownType[];
};

const ReportingComp: FC<Props> = ({
  submitCallback,
  carId,
  locations = [],
  couponNumbers = [],
  fillTypes = []
}) => {
  const [localReportForm, setLocalReportForm] = useState<ReportForm>({
    carId,
    liters: 0,
    fillTypeId: "",
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
    logger.debug("Submitting form ReportingComp");
    submitCallback(localReportForm);
    setFormSubmitAttempts(0);
    event.preventDefault();
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
        <VStack align="center" justify="center">
          <FormControl id="car-id" isReadOnly>
            <FormLabel>Car id:</FormLabel>
            <Input type="text" value={carId} />
          </FormControl>

          <FormControl
            isInvalid={
              formSubmitAttempts > 0 && locations.every(l => localReportForm.locationId !== l.id)
            }
            isRequired>
            <FormLabel>Select location:</FormLabel>
            <Select
              placeholder="Select location"
              onChange={e => updateLocalForm(e.target.value, "locationId")}>
              {locations.map(path => (
                <option key={path.id} value={path.id}>
                  {path.name}
                </option>
              ))}
            </Select>
            <FormErrorMessage>Please select one of the allowed locations</FormErrorMessage>
          </FormControl>

          <FormControl
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
              formSubmitAttempts > 0 && fillTypes.every(ft => localReportForm.fillTypeId !== ft.id)
            }
            isRequired>
            <FormLabel>Select fill type:</FormLabel>
            <Select
              onChange={e => updateLocalForm(e.target.value, "fillTypeId")}
              placeholder="Select option">
              {fillTypes.map(path => (
                <option key={path.id} value={path.id}>
                  {path.name}
                </option>
              ))}
            </Select>
            <FormErrorMessage>Please select one of the allowed tank types</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={formSubmitAttempts > 0 && localReportForm.liters <= 0} isRequired>
            <FormLabel>Amount filled:</FormLabel>

            <InputGroup>
              <Input
                placeholder="Enter amount filled into tank"
                onChange={e => updateLocalForm(e.target.valueAsNumber, "liters")}
                type="number"
              />
              <InputRightAddon>liters</InputRightAddon>
            </InputGroup>
            <FormErrorMessage>
              Please enter the amount of liters filled into the tank
            </FormErrorMessage>
          </FormControl>

          <FormControl>
            <HStack>
              <FormLabel mb={4}>Is special fill:</FormLabel>
              <Checkbox
                mb={4}
                onChange={e => updateLocalForm(e.target.checked, "isSpecialFill")}></Checkbox>
            </HStack>
          </FormControl>

          <FormControl
            isInvalid={formSubmitAttempts > 0 && localReportForm.image.length <= 0}
            isRequired>
            <HStack>
              {localReportForm.image.length > 0 ? (
                <Button onClick={onOpen} rightIcon={<IoMdEye />}>
                  View Image
                </Button>
              ) : (
                <Button
                  colorScheme="blue"
                  rightIcon={<IoMdCamera />}
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
              rightIcon={<IoMdRepeat />}
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
