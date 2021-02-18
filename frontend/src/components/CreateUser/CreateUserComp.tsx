import { Button, FormControl, FormErrorMessage, FormLabel, Input, VStack } from "@chakra-ui/react";
import UserRoleSelector from "components/UserRoleSelector/UserRoleSelector";
import { useI18n } from "next-rosetta";
import React, { FC, FormEvent, useCallback, useState } from "react";
import { MdCheck } from "react-icons/md";
import { CreateUserCommand, ICreateUserCommand } from "services/backend/nswagts";
import { logger } from "utils/logger";

type Props = {
  submitCallback: (createUserForm: ICreateUserCommand) => void;
};

const CreateUserComp: FC<Props> = ({ submitCallback }) => {
  const { t } = useI18n<Locale>();

  const [localForm, setLocalForm] = useState<ICreateUserCommand>({
    userName: "",
    password: "",
    roleId: 0
  });

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
      submitCallback(localForm);
      setFormSubmitAttempts(0);
    },
    [localForm]
  );

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={2}>
        <FormControl isRequired isInvalid={formSubmitAttempts > 0 && !localForm.userName}>
          <FormLabel>{t("createUser.userName")}</FormLabel>
          <Input
            placeholder={t("createUser.userName") as string}
            onChange={e => {
              updateLocalForm(e.target.value, "userName");
            }}
          />
          <FormErrorMessage>{t("createUser.formErrors.enterUsername")}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={formSubmitAttempts > 0 && !localForm.password}>
          <FormLabel>{t("createUser.password")}</FormLabel>
          <Input
            type="password"
            placeholder={t("createUser.password") as string}
            onChange={e => {
              updateLocalForm(e.target.value, "password");
            }}
          />
          <FormErrorMessage>{t("createUser.formErrors.enterPassword")}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={formSubmitAttempts > 0 && !localForm.roleId}>
          <FormLabel>{t("createUser.role")}</FormLabel>

          <UserRoleSelector
            cb={x => {
              updateLocalForm(Number(x.id), "roleId");
            }}
          />
          <FormErrorMessage>{t("createUser.formErrors.chooseRole")}</FormErrorMessage>
        </FormControl>
        <Button
          colorScheme="green"
          type="submit"
          rightIcon={<MdCheck />}
          onClick={() => setFormSubmitAttempts(x => x + 1)}>
          {t("createUser.createUser")}
        </Button>
      </VStack>
    </form>
  );
};

export default CreateUserComp;
