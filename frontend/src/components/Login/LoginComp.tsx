import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack
} from "@chakra-ui/react";
import React, { FC, FormEvent, useCallback, useState } from "react";
import { MdCheck } from "react-icons/md";
import { IUserDto } from "services/backend/nswagts";
import { logger } from "utils/logger";

type Props = {
  submitCallback: (loginForm: IUserDto) => void;
};

const LoginComp: FC<Props> = ({ submitCallback }) => {
  const [show, setShow] = React.useState(false);
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
          <InputGroup size="md">
            <Input
              type={show ? "text" : "password"}
              onChange={e => updateLocalForm(e.target.value, "password")}
            />
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="sm"
                onMouseDown={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
                onMouseUp={() => setShow(false)}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
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
