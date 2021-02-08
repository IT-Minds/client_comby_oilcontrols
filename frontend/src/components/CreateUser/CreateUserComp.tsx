import { Button, FormControl, FormErrorMessage, FormLabel, Input, VStack } from "@chakra-ui/react";
import UserRoleSelector from "components/UserRoleSelector/UserRoleSelector";
import React, { FC, FormEvent, useCallback, useState } from "react";
import { MdCheck } from "react-icons/md";
import { CreateUserCommand } from "services/backend/nswagts";
import { logger } from "utils/logger";

type Props = {
  submitCallback: (createUserForm: CreateUserCommand, role: string) => void;
};

const CreateUserComp: FC<Props> = ({ submitCallback }) => {
  const [localForm, setLocalForm] = useState<CreateUserCommand>(
    new CreateUserCommand({
      userName: "",
      password: ""
    })
  );

  const [role, setRole] = useState(null);

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
      if (role) {
        logger.debug("Submitting form CreateUserComp");
        submitCallback(localForm, role);
      }
      setFormSubmitAttempts(0);
    },
    [localForm, role]
  );

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={2}>
        <FormControl isRequired isInvalid={formSubmitAttempts > 0 && !localForm.userName}>
          {
            //TODO: translation
          }
          <FormLabel>Username</FormLabel>
          <Input
            placeholder="Username"
            onChange={e => {
              updateLocalForm(e.target.value, "userName");
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

        <FormControl isRequired isInvalid={formSubmitAttempts > 0 && !role}>
          {
            //TODO: translation
          }
          <FormLabel>Role</FormLabel>

          <UserRoleSelector
            cb={x => {
              setRole(x.name);
            }}></UserRoleSelector>
          {
            //TODO: translation
          }
          <FormErrorMessage>Please choose a role</FormErrorMessage>
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
