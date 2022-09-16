import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { IResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponseType>
) {
  res.json({
    ok: true,
    url: "",
  });
}
export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
