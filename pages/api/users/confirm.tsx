import client from "@libs/server/client";
import withHandler, { IResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponseType>
) {
  const { token } = req.body;
}

export default withHandler("POST", handler);
