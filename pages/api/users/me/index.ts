import client from "@libs/server/client";
import withHandler, { IResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponseType>
) {
  const {
    session: { user },
  } = req;
  const profile = await client.user.findUnique({
    where: {
      id: user?.id,
    },
  });
  res.json({ ok: true, profile });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
