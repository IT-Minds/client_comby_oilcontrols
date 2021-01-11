import { Box, Button, ButtonGroup } from "@chakra-ui/react";
import { FC } from "react";
import React, { useState } from "react";
import { isBrowser, isMobile } from "react-device-detect";
import Camera from "react-webcam";
import Webcam from "react-webcam";

import styles from "./styles.module.css";

type Props = {
  buildTime: number;
};

const camConstraints: MediaTrackConstraints = {
  facingMode: { exact: "environment" }
};

const webcamConstraints = {
  facingMode: "user"
};

const CameraComp: FC<Props> = () => {
  const [openCam, setOpenCam] = useState(true);
  const [source, setSource] = useState("");
  const webcamRef = React.useRef(null);

  const capture = React.useCallback(() => {
    setSource(webcamRef.current.getScreenshot());
    setOpenCam(false);
  }, [webcamRef]);

  const openCamera = () => {
    setOpenCam(true);
    setSource(null);
  };

  return (
    <main>
      <Box className={styles.marginTop}>
        {isMobile && openCam && (
          <Camera
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={camConstraints}
          />
        )}

        {isBrowser && openCam && (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={webcamConstraints}
          />
        )}

        {source && <img src={source} alt=""></img>}

        <Button colorScheme="blue" className={styles.marginTop} onClick={capture}>
          Take picture
        </Button>

        {source && (
          <ButtonGroup spacing="6" className={styles.marginTop}>
            {/* TODO: Missing 'save' functionality */}
            <Button colorScheme="blue" onClick={null}>
              Save
            </Button>
            <Button colorScheme="blue" onClick={openCamera}>
              Discard
            </Button>
          </ButtonGroup>
        )}
      </Box>
    </main>
  );
};

export default CameraComp;
