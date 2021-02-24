import { useEffectAsync } from "hooks/useEffectAsync";
import { FC, useState } from "react";
import { genLocationClient } from "services/backend/apiClients";
import { ILocationRefillDto } from "services/backend/nswagts";

import ImageModal from "./ImageModal";

type Props = {
  location: ILocationRefillDto;
};

const LocationImageModal: FC<Props> = ({ location }) => {
  const [base64, setBase64] = useState<string>(null);

  useEffectAsync(async () => {
    const client = await genLocationClient();
    const image = await client.getLocationImage(location.locationId);

    if (image[0]?.stream) setBase64("data:text/plain;base64," + image[0]?.stream);
  }, [location]);

  return base64 && <ImageModal image={base64} />;
};
export default LocationImageModal;
