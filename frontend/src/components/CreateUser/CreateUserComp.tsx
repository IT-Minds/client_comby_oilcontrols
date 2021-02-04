import { Button, FormControl, FormErrorMessage, FormLabel, Input, VStack } from "@chakra-ui/react";
import React, { FC, FormEvent, useCallback, useState } from "react";
import { MdCheck } from "react-icons/md";
import { CreateUserCommand } from "services/backend/nswagts";
import { logger } from "utils/logger";

type Props = {
  submitCallback: (createUserForm: CreateUserCommand) => void;
};

const CreateUserComp: FC<Props> = ({ submitCallback }) => {
  const [localForm, setLocalForm] = useState<CreateUserCommand>(
    new CreateUserCommand({
      userName: "",
      password: ""
    })
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
