import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select,
  VStack
} from "@chakra-ui/react";
import React, { FC, FormEvent, useCallback, useState } from "react";
import { MdCheck } from "react-icons/md";
import DropdownType from "types/DropdownType";
import { logger } from "utils/logger";

import { OrderRefillForm } from "./OrderRefillForm";

type Props = {
  submitCallback: (orderRefillForm: OrderRefillForm) => void;
  locations: DropdownType[];
};

const OrderRefillComp: FC<Props> = ({ submitCallback, locations = [] }) => {
  const [localOrderRefillForm, setLocalOrderRefillForm] = useState<OrderRefillForm>({
    locationId: "",
    expectedDeliveryDate: 0,
    routeId: ""
  });

  const [formSubmitAttempts, setFormSubmitAttempts] = useState(0);

  const updateLocalForm = useCallback((value: unknown, key: keyof OrderRefillForm) => {
    setLocalOrderRefillForm(form => {
      (form[key] as unknown) = value;
      return form;
    });
  }, []);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      logger.debug("Submitting form OrderRefillComp");
      submitCallback(localOrderRefillForm);
      setFormSubmitAttempts(0);
      event.preventDefault();
    },
    [localOrderRefillForm]
  );

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <VStack align="center" justify="center">
          <FormControl
            isInvalid={
              formSubmitAttempts > 0 &&
              locations.every(b => localOrderRefillForm.locationId !== b.id)
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
            <FormErrorMessage>Please select a location</FormErrorMessage>
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
    </Container>
  );
};

export default OrderRefillComp;
