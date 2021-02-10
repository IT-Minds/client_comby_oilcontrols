import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import UserRoleSelector from "components/UserRoleSelector/UserRoleSelector";
import React, { FC, useCallback, useState } from "react";
import { MdAdd, MdEdit } from "react-icons/md";
import { genUserClient } from "services/backend/apiClients";
import {
  IRoleDto,
  IUserIdDto,
  UpdatePasswordCommand,
  UpdateUserRolesCommand
} from "services/backend/nswagts";

type Props = {
  user: IUserIdDto;
  userCallback: (user: IUserIdDto) => void;
};

const UserDetailModal: FC<Props> = ({ user, userCallback }) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = React.useState(false);
  const [newPassword, setNewPassword] = useState(null);
  const [repeatNewPassword, setRepeateNewPassword] = useState(null);
  const [passwordSubmitAttempts, setPasswordSubmitAttempts] = useState(0);

  const [roleSubmitAttempts, setRoleSubmitAttempts] = useState(0);
  const [role, setRole] = useState<IRoleDto>(null);

  const updatePassword = useCallback(async () => {
    const client = await genUserClient();
    {
      //TODO: waiting for backend query
    }
    await client.updateUserPassword(
      user.id,
      new UpdatePasswordCommand({
        password: newPassword
      })
    );
    toast({
      title: "Password Updated",
      description: "Successful",
      status: "success",
      duration: 9000,
      isClosable: true
    });
  }, [newPassword, repeatNewPassword]);

  const updateRole = useCallback(async () => {
    if (role) {
      const client = await genUserClient();
      await client.updateUserRoles(user.id, new UpdateUserRolesCommand({ role: role.name }));
      toast({
        title: "Role Updated",
        description: "Successful",
        status: "success",
        duration: 9000,
        isClosable: true
      });
      userCallback({ ...user, currentRole: role });
    }
  }, [role]);

  return (
    <>
      <IconButton
        size="sm"
        onClick={onOpen}
        aria-label="Open Details for user"
        icon={<MdEdit size={24} />}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Manage User {user.username}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl
              isInvalid={
                passwordSubmitAttempts > 0 &&
                (!newPassword || !repeatNewPassword || newPassword !== repeatNewPassword)
              }>
              {
                //TODO: translation
              }
              <FormLabel id="fuel-type">New password</FormLabel>

              <InputGroup size="md">
                <Input
                  type={showPassword ? "text" : "password"}
                  mb={4}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Password"
                />

                <InputRightElement width="4.5rem">
                  <Button
                    size="sm"
                    onMouseDown={() => setShowPassword(true)}
                    onTouchStart={() => setShowPassword(true)}
                    onTouchEnd={() => setShowPassword(false)}
                    onTouchCancel={() => setShowPassword(false)}
                    onMouseLeave={() => setShowPassword(false)}
                    onMouseUp={() => setShowPassword(false)}>
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>

              <InputGroup>
                <Input
                  type={showRepeatPassword ? "text" : "password"}
                  onChange={e => setRepeateNewPassword(e.target.value)}
                  placeholder="Repeat password"
                />
                <InputRightElement width="4.5rem">
                  <Button
                    size="sm"
                    onMouseDown={() => setShowRepeatPassword(true)}
                    onTouchStart={() => setShowRepeatPassword(true)}
                    onTouchEnd={() => setShowRepeatPassword(false)}
                    onTouchCancel={() => setShowRepeatPassword(false)}
                    onMouseLeave={() => setShowRepeatPassword(false)}
                    onMouseUp={() => setShowRepeatPassword(false)}>
                    {showRepeatPassword ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
              {
                //TODO: translation
              }
              <FormErrorMessage>
                Please input a new password and make sure they match
              </FormErrorMessage>
            </FormControl>

            <Button
              mt={4}
              colorScheme="green"
              rightIcon={<MdAdd />}
              type="submit"
              onClick={() => {
                setPasswordSubmitAttempts(x => x + 1);
                updatePassword();
              }}>
              {
                //TODO: translation
              }
              Update Password
            </Button>

            <FormControl mt={4} isInvalid={roleSubmitAttempts > 0 && !role}>
              {
                //TODO: translation
              }
              <FormLabel>User role</FormLabel>

              <UserRoleSelector
                preselectedValue={
                  role ? { id: "0", name: role.name } : { id: "0", name: user.currentRole?.name }
                }
                cb={x => {
                  setRole(x);
                }}
              />
              {
                //TODO: translation
              }
              <FormErrorMessage>Please choose a role</FormErrorMessage>
            </FormControl>

            {
              //TODO: translation
            }
            <Button
              mt={4}
              mb={4}
              colorScheme="green"
              type="submit"
              rightIcon={<MdAdd />}
              onClick={() => {
                setRoleSubmitAttempts(x => x + 1);
                updateRole();
              }}>
              Update role
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserDetailModal;
