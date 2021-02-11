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
import { useI18n } from "next-rosetta";
import React, { FC, FormEvent, useCallback, useState } from "react";
import { MdCheck } from "react-icons/md";
import { IAssignTokenCommand } from "services/backend/nswagts";
import { logger } from "utils/logger";

type Props = {
  submitCallback: (loginForm: IAssignTokenCommand) => Promise<unknown>;
};

const LoginComp: FC<Props> = ({ submitCallback }) => {
  const { t } = useI18n<Locale>();

  const [show, setShow] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [localForm, setLocalForm] = useState<IAssignTokenCommand>({
    username: "",
    password: ""
  });

  const [formSubmitAttempts, setFormSubmitAttempts] = useState(0);

  const updateLocalForm = useCallback((value: unknown, key: keyof IAssignTokenCommand) => {
    setLocalForm(form => {
      (form[key] as unknown) = value;
      return form;
    });
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      logger.debug("Submitting form LoginForm");
      setLoading(true);
      setFormSubmitAttempts(0);
      event.preventDefault();

      await submitCallback(localForm);
      setLoading(false);
    },
    [localForm]
  );

  return (
    <form onSubmit={handleSubmit}>
      <VStack align="center" justify="center">
        <FormControl isRequired isInvalid={formSubmitAttempts > 0 && !localForm.username}>
          <FormLabel>{t("login.username")}</FormLabel>
          <Input onChange={e => updateLocalForm(e.target.value, "username")} />
          <FormErrorMessage>{t("login.formErrors.enterUsername")}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={formSubmitAttempts > 0 && !localForm.password}>
          <FormLabel>{t("login.password")}</FormLabel>
          <InputGroup size="md">
            <Input
              type={show ? "text" : "password"}
              onChange={e => updateLocalForm(e.target.value, "password")}
            />
            <InputRightElement width="4.5rem">
              <Button
                size="sm"
                onMouseDown={() => setShow(true)}
                onTouchStart={() => setShow(true)}
                onTouchEnd={() => setShow(false)}
                onTouchCancel={() => setShow(false)}
                onMouseLeave={() => setShow(false)}
                onMouseUp={() => setShow(false)}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>{t("login.formErrors.enterPassword")}</FormErrorMessage>
        </FormControl>

        <Button
          colorScheme="green"
          type="submit"
          rightIcon={<MdCheck />}
          onClick={() => setFormSubmitAttempts(x => x + 1)}
          isLoading={loading}>
          {t("login.login")}
        </Button>
      </VStack>
    </form>
  );
};

export default LoginComp;
