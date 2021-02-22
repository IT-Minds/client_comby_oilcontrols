import {
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Spacer,
  Text,
  Tooltip,
  VStack
} from "@chakra-ui/react";
import { useI18n } from "next-rosetta";
import React, { FC, FormEvent, useCallback, useState } from "react";
import { MdCheck } from "react-icons/md";
import { ActionRecord } from "services/backend/ext/enumConvertor";
import { Action, IRoleDto, IRoleIdDto } from "services/backend/nswagts";
import { logger } from "utils/logger";

type Props = {
  submitCallback: (createUserForm: IRoleIdDto | IRoleDto) => void;
  value?: IRoleIdDto;
};

const CreateRoleComp: FC<Props> = ({ submitCallback, value }) => {
  const { t } = useI18n<Locale>();

  const [localForm, setLocalForm] = useState<IRoleDto>(
    value ?? {
      name: "",
      actions: []
    }
  );

  const [localActions, setLocalActions] = useState<number[]>([]);

  const [formSubmitAttempts, setFormSubmitAttempts] = useState(0);

  const updateLocalForm = useCallback((value: unknown, key: keyof typeof localForm) => {
    setLocalForm(form => {
      (form[key] as unknown) = value;
      return form;
    });
  }, []);

  const setRole = useCallback(
    (type: number) => {
      let newArr = [...localActions];
      newArr.includes(type) ? (newArr = newArr.filter(n => n !== type)) : newArr.push(type);
      setLocalActions(newArr);
    },
    [localActions]
  );

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      logger.debug("Submitting form CreateRoleComp");
      localForm.actions = localActions;
      if (localForm.actions.length > 0) {
        submitCallback(localForm);
        setFormSubmitAttempts(0);
      }
    },
    [localForm, localActions]
  );

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={2}>
        <FormControl isRequired isInvalid={formSubmitAttempts > 0 && !localForm.name}>
          <FormLabel>{t("createRole.roleName")}</FormLabel>
          <Input
            placeholder={t("createRole.roleName") as string}
            onChange={e => {
              updateLocalForm(e.target.value, "name");
            }}
          />
          <FormErrorMessage>{t("createRole.formErrors.enterRoleName")}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={formSubmitAttempts > 0 && localActions.length < 1}>
          <FormLabel>{t("createRole.roleAction")}</FormLabel>
          {Object.entries(ActionRecord).map(([a, b], i) => (
            <HStack key={b}>
              <Tooltip label={a} fontSize="md" hasArrow placement="top" shouldWrapChildren>
                <Text>{`${i}: ` + t("enums.action." + b)}</Text>
              </Tooltip>
              <Spacer></Spacer>
              <Checkbox onChange={() => setRole(b)}></Checkbox>
            </HStack>
          ))}
          <FormErrorMessage>{t("createRole.formErrors.selectActions")}</FormErrorMessage>
        </FormControl>
        <Button
          colorScheme="green"
          type="submit"
          rightIcon={<MdCheck />}
          onClick={() => setFormSubmitAttempts(x => x + 1)}>
          {t("createRole.createRole")}
        </Button>
      </VStack>
    </form>
  );
};

export default CreateRoleComp;
