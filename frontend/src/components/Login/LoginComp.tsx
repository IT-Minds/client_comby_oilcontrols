import { Button, FormControl, FormErrorMessage, FormLabel, Input, VStack } from "@chakra-ui/react";
import React, { FC, FormEvent, useCallback, useState } from "react";
import { MdCheck } from "react-icons/md";
import { IUserDto } from "services/backend/nswagts";
import { logger } from "utils/logger";

type Props = {
  submitCallback: (loginForm: IUserDto) => void;
};

const LoginComp: FC<Props> = ({ submitCallback }) => {
  const [localForm, setLocalForm] = useState<IUserDto>({
    username: "",
    password: ""
  });

  const [formSubmitAttempts, setFormSubmitAttempts] = useState(0);

  const updateLocalForm = useCallback((value: unknown, key: keyof IUserDto) => {
    setLocalForm(form => {
      (form[key] as unknown) = value;
      return form;
    });
  }, []);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      logger.debug("Submitting form LoginForm");

      submitCallback(localForm);
      setFormSubmitAttempts(0);
      event.preventDefault();
    },
    [localForm]
  );

  return (
    <form onSubmit={handleSubmit}>
      <VStack align="center" justify="center">
        <FormControl isRequired isInvalid={formSubmitAttempts > 0 && !localForm.username}>
          <FormLabel>Username</FormLabel>
          <Input onChange={e => updateLocalForm(e.target.value, "username")} />
          <FormErrorMessage>Please enter a username</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={formSubmitAttempts > 0 && !localForm.password}>
          <FormLabel>Password</FormLabel>
          <Input type="password" onChange={e => updateLocalForm(e.target.value, "password")} />
          <FormErrorMessage>Please enter a password</FormErrorMessage>
        </FormControl>

        <Button
          colorScheme="green"
          type="submit"
          rightIcon={<MdCheck />}
          onClick={() => setFormSubmitAttempts(x => x + 1)}>
          Login
        </Button>
      </VStack>
    </form>
  );
};

export default LoginComp;
