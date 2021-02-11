import { Button, Container, FormControl, FormErrorMessage, Switch } from "@chakra-ui/react";
import { FormLabel, HStack, Image, Input, InputGroup } from "@chakra-ui/react";
import { InputRightAddon, Modal, ModalBody, ModalCloseButton } from "@chakra-ui/react";
import { ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { Select, useDisclosure, VStack } from "@chakra-ui/react";
import CameraComp from "components/Camera/CameraComponent";
import React, { FC, FormEvent, useCallback, useState } from "react";
import { MdCheck, MdPhotoCamera, MdRemoveRedEye, MdRepeat } from "react-icons/md";
import { FuelTypeRecord } from "services/backend/ext/enumConvertor";
import { FuelType } from "services/backend/nswagts";
import DropdownType from "types/DropdownType";
import { capitalize } from "utils/capitalizeAnyString";
import { formatInputNumber, parseInputToNumber } from "utils/formatNumber";
import { logger } from "utils/logger";

import { RefillForm } from "./RefillForm";

type Props = {
  submitCallback: (reportForm: RefillForm) => void;
  couponNumbers?: DropdownType[];
};

const FillOutRefillForm: FC<Props> = ({ submitCallback, couponNumbers = [] }) => {
  const [localReportForm, setLocalReportForm] = useState<RefillForm>({
    startliters: 0,
    endliters: 0,
    fuelType: null,
    couponNumber: couponNumbers[0]?.name ?? "",
    isSpecialFill: false,
    image: ""
  });

  const [isTakingPic, setIsTakingPic] = useState(false);
  const [formSubmitAttempts, setFormSubmitAttempts] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const updateLocalForm = useCallback((value: unknown, key: keyof RefillForm) => {
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
          <FormControl
            id="coupon-no"
            isInvalid={
              formSubmitAttempts > 0 &&
              couponNumbers.every(cn => localReportForm.couponNumber !== cn.id)
            }
            isRequired>
            <FormLabel>Select coupon number:</FormLabel>
            <Select onChange={e => updateLocalForm(e.target.value, "couponNumber")}>
              {couponNumbers.map(path => (
                <option key={path.id} value={path.name}>
                  {path.name}
                </option>
              ))}
            </Select>
            <FormErrorMessage>Please select one of the allowed coupons</FormErrorMessage>
          </FormControl>

          <FormControl
            isInvalid={
              formSubmitAttempts > 0 &&
              Object.values(FuelTypeRecord).every(
                key => localReportForm.fuelType !== (FuelType[key] as unknown)
              )
            }
            isRequired>
            <FormLabel id="fuel-type">Select fuel type:</FormLabel>
            <Select
              onChange={e => updateLocalForm(FuelType[Number(e.target.value)], "fuelType")}
              placeholder="Select option">
              {Object.entries(FuelTypeRecord).map(([a, b]) => (
                <option key={b} value={b}>
                  {capitalize(a)}
                </option>
              ))}
            </Select>
            <FormErrorMessage>Please select one of the allowed fuel types</FormErrorMessage>
          </FormControl>
          <FormControl
            id="liters"
            isInvalid={formSubmitAttempts > 0 && isNaN(localReportForm.endliters)}
            isRequired>
            <FormLabel>Fuel in tank AFTER refill:</FormLabel>

            <InputGroup>
              <Input
                placeholder="Enter "
                onChange={e =>
                  updateLocalForm(
                    parseInputToNumber(formatInputNumber(e.target.value)),
                    "endliters"
                  )
                }
                minW="50%"></Input>
              <InputRightAddon>liters</InputRightAddon>
            </InputGroup>
            <FormErrorMessage>Please enter a valid amount of liters</FormErrorMessage>
          </FormControl>

          <FormControl
            id="liters"
            isInvalid={formSubmitAttempts > 0 && isNaN(localReportForm.startliters)}
            isRequired>
            <FormLabel>Fuel in tank BEFORE refill:</FormLabel>

            <InputGroup>
              <Input
                placeholder="Enter amount filled into tank"
                onChange={e =>
                  updateLocalForm(
                    parseInputToNumber(formatInputNumber(e.target.value)),
                    "startliters"
                  )
                }
                minW="50%"></Input>
              <InputRightAddon>liters</InputRightAddon>
            </InputGroup>
            <FormErrorMessage>Please enter a valid amount of liters</FormErrorMessage>
          </FormControl>

          <FormControl mb={4} display="flex" alignItems="center">
            <HStack>
              <FormLabel mb={0}>Is partial fill:</FormLabel>
              <Switch
                id="partial"
                onChange={e => updateLocalForm(e.target.checked, "isSpecialFill")}
              />
              {/* <Checkbox
                mb={4}
                ></Checkbox> */}
            </HStack>
          </FormControl>

          <HStack justifyContent="space-between" w="100%">
            <FormControl
              id="photo"
              isInvalid={formSubmitAttempts > 0 && localReportForm.image.length <= 0}
              isRequired
              w="unset">
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
            </FormControl>
            <Button
              colorScheme="green"
              type="submit"
              rightIcon={<MdCheck />}
              onClick={() => setFormSubmitAttempts(x => x + 1)}>
              Submit
            </Button>
          </HStack>
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

export default FillOutRefillForm;
