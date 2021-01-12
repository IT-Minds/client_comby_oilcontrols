import { Button, VStack } from "@chakra-ui/react";
import { FC } from "react";
import { useCallback, useRef } from "react";
import { isBrowser, isMobile } from "react-device-detect";
import Camera from "react-webcam";
import Webcam from "react-webcam";

import styles from "./styles.module.css";

type Props = {
  imgSource: (screenshot: string) => void;
};

const camConstraints: MediaTrackConstraints = {
  facingMode: { exact: "environment" }
};

const webcamConstraints = {
  facingMode: "user"
};

const CameraComp: FC<Props> = ({ imgSource }) => {
  const webcamRef = useRef<Camera>(null);

  const capture = () => {
    imgSource(webcamRef.current.getScreenshot());
  };

  return (
    <main>
      <VStack>
        {isMobile && (
          <Camera
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/png"
            videoConstraints={camConstraints}
          />
        )}

        {isBrowser && (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/png"
            videoConstraints={webcamConstraints}
          />
        )}

        <Button colorScheme="blue" className={styles.marginTop} onClick={capture}>
          Take picture
        </Button>
      </VStack>
    </main>
  );
};

export default CameraComp;
