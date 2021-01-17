import {
  AlertDialog,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Text,
  useDisclosure
} from "@chakra-ui/react";
import { UserTypeContext } from "contexts/UserTypeContext";
import { Locale } from "i18n/Locale";
import { useI18n } from "next-rosetta";
import { FC, useCallback, useContext, useRef } from "react";
import { UserType } from "types/UserType";

const UserTypeSwitcher: FC = () => {
  const cancelRef = useRef();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useI18n<Locale>();

  const { setUserType } = useContext(UserTypeContext);

  const choice = useCallback((ut: UserType) => {
    setUserType(ut);
    onClose();
  }, []);

  return (
    <>
      <Text onClick={onOpen}>{t("user.type.switch")}</Text>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered>
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>{t("user.type.switchConfirm")}</AlertDialogHeader>
          <AlertDialogCloseButton ref={cancelRef} />

          <AlertDialogFooter>
            <Button colorScheme="blue" onClick={() => choice(UserType.DRIVER)}>
              {t("user.type.DRIVER")}
            </Button>
            <Button colorScheme="blue" ml={3} onClick={() => choice(UserType.OFFICE_WORKER)}>
              {t("user.type.OFFICE_WORKER")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserTypeSwitcher;
