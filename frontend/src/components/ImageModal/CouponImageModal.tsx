import { useEffectAsync } from "hooks/useEffectAsync";
import { FC, useState } from "react";
import { genRefillClient } from "services/backend/apiClients";
import { ILocationRefillDto } from "services/backend/nswagts";

import ImageModal from "./ImageModal";

type Props = {
  location: Pick<ILocationRefillDto, "refillId">;
};

const CouponImageModal: FC<Props> = ({ location }) => {
  const [base64, setBase64] = useState<string>(null);

  useEffectAsync(async () => {
    const client = await genRefillClient();
    const image = await client.getCouponImage(location.refillId);

    if (image[0]?.stream) setBase64("data:text/plain;base64," + image[0]?.stream);
  }, [location]);

  return base64 && <ImageModal image={base64} />;
};
export default CouponImageModal;
