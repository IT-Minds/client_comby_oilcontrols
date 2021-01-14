import { NextApiHandler } from "next";
import { serverEnv } from "utils/envSettings";

const handler: NextApiHandler = (_req, res) => {
  res.status(200).json(serverEnv());
};

export default handler;
