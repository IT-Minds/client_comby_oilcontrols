import { Button, Center, VStack } from "@chakra-ui/react";
import { useI18n } from "next-rosetta";
import { FC } from "react";
import { useCallback, useRef } from "react";
import { isBrowser } from "react-device-detect";
import Webcam from "react-webcam";

import styles from "./styles.module.css";

type Props = {
  imgSource: (screenshot: string) => void;
};

const mobileConstraints: MediaTrackConstraints = {
  facingMode: { exact: "environment" }
};

const browserContains = {
  facingMode: "user"
};

const CameraComp: FC<Props> = ({ imgSource }) => {
  const webcamRef = useRef<Webcam>(null);
  const { t } = useI18n<Locale>();

  const capture = useCallback(() => {
    imgSource(webcamRef.current.getScreenshot());
  }, []);

  return (
    <VStack>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/webp"
        videoConstraints={isBrowser ? browserContains : mobileConstraints}
      />
      <Center>
        <Button className={styles.marginTop} colorScheme="teal" onClick={capture}>
          {t("camera.takePicture")}
        </Button>
      </Center>
    </VStack>
  );
};

export default CameraComp;
