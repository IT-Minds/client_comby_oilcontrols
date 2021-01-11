import { Box, Button } from "@chakra-ui/react";
import { FC } from "react";
import { useCallback, useRef } from "react";
import { isBrowser, isMobile } from "react-device-detect";
import Camera from "react-webcam";
import Webcam from "react-webcam";

import styles from "./styles.module.css";

type Props = {
  imgSource: (x: any) => void;
};

const camConstraints: MediaTrackConstraints = {
  facingMode: { exact: "environment" }
};

const webcamConstraints = {
  facingMode: "user"
};

const CameraComp: FC<Props> = ({ imgSource }) => {
  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    imgSource(webcamRef.current.getScreenshot());
  }, [webcamRef]);

  return (
    <main>
      <Box className={styles.marginTop}>
        {isMobile && (
          <Camera
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={camConstraints}
          />
        )}

        {isBrowser && (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={webcamConstraints}
          />
        )}

        <Button colorScheme="blue" className={styles.marginTop} onClick={capture}>
          Take picture
        </Button>
      </Box>
    </main>
  );
};

export default CameraComp;
