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
  VStack
} from "@chakra-ui/react";
import React, { FC, FormEvent, useCallback, useState } from "react";
import { MdCheck } from "react-icons/md";
import { ActionRecord } from "services/backend/ext/enumConvertor";
import { Action, RoleDto } from "services/backend/nswagts";
import { logger } from "utils/logger";

type Props = {
  submitCallback: (createUserForm: RoleDto) => void;
};

const CreateRoleComp: FC<Props> = ({ submitCallback }) => {
  const [localForm, setLocalForm] = useState<RoleDto>(
    new RoleDto({
      name: "",
      actions: []
    })
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
          {
            //TODO: translation
          }
          <FormLabel>Role name</FormLabel>
          <Input
            placeholder="Role name"
            onChange={e => {
              updateLocalForm(e.target.value, "name");
            }}
          />
          {
            //TODO: translation
          }
          <FormErrorMessage>Please enter a role name</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={formSubmitAttempts > 0 && localActions.length < 1}>
          {
            //TODO: translation
          }
          <FormLabel>Role action</FormLabel>
          {Object.entries(ActionRecord).map(([a, b]) => (
            <HStack key={b}>
              <Text>{Action[Number(b)]}</Text>
              <Spacer></Spacer>
              <Checkbox onChange={e => setRole(b)}></Checkbox>
            </HStack>
          ))}

          {
            //TODO: translation
          }
          <FormErrorMessage>Please select one or more actions</FormErrorMessage>
        </FormControl>

        {
          //TODO: translation
        }
        <Button
          colorScheme="green"
          type="submit"
          rightIcon={<MdCheck />}
          onClick={() => setFormSubmitAttempts(x => x + 1)}>
          Create role
        </Button>
      </VStack>
    </form>
  );
};

export default CreateRoleComp;
