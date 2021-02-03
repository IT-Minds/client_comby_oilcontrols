import {
    Button,
    Container,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    InputGroup,
    InputRightAddon,
    NumberInput,
    NumberInputField,
    Select,
    VStack
  } from "@chakra-ui/react";
  import StreetSelector from "components/StreetSelector/StreetSelector";
  import React, { FC, FormEvent, useCallback, useState } from "react";
  import { MdCheck } from "react-icons/md";
  import { RefillScheduleRecord } from "services/backend/ext/enumConvertor";
  import { RefillSchedule, TankType } from "services/backend/nswagts";
  import { capitalize } from "utils/capitalizeAnyString";
  import { logger } from "utils/logger";
import { CreateUserForm } from "./CreateUserForm";
  
  type Props = {
    submitCallback: (createUserForm: CreateUserForm) => void;
  };
  
  const CreateUserComp: FC<Props> = ({ submitCallback }) => {
    const [localForm, setLocalForm] = useState<CreateUserForm>(
      {
          username: "",
          password: ""
      }
    );
  
    const [formSubmitAttempts, setFormSubmitAttempts] = useState(0);
  
    const updateLocalForm = useCallback((value: unknown, key: keyof typeof localForm) => {
      setLocalForm(form => {
        (form[key] as unknown) = value;
        return form;
      });
    }, []);
  
    const handleSubmit = useCallback(
      (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        logger.debug("Submitting form CreateUserComp");
        submitCallback(localForm);
        setFormSubmitAttempts(0);
      },
      [localForm]
    );
  
    return (
      <form onSubmit={handleSubmit}>
        <VStack spacing={2}>
           <FormControl isRequired isInvalid={formSubmitAttempts > 0 && !localForm.username}>
            {
              //TODO: translation
            }
            <FormLabel>Username</FormLabel>
            <Input
              placeholder="Username"
              onChange={e => {
                updateLocalForm(e.target.value, "username");
              }}
            />
            {
              //TODO: translation
            }
            <FormErrorMessage>Please enter a username</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={formSubmitAttempts > 0 && !localForm.password}>
            {
              //TODO: translation
            }
            <FormLabel>Password</FormLabel>
            <Input
            type="password"
              placeholder="Password"
              onChange={e => {
                updateLocalForm(e.target.value, "password");
              }}
            />
            {
              //TODO: translation
            }
            <FormErrorMessage>Please enter a password</FormErrorMessage>
          </FormControl>
  
          {
            //TODO: translation
          }
          <Button
            colorScheme="green"
            type="submit"
            rightIcon={<MdCheck />}
            onClick={() => setFormSubmitAttempts(x => x + 1)}>
            Create user
          </Button>
        </VStack>
      </form>
    );
  };
  
  export default CreateUserComp;
  