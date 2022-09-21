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
    query: { id },
    body: { buyorsold, ttsId, isBuyer },
  } = req;
  if (isBuyer) {
    const isBuy = await client.talkToSeller.update({
      where: { id: Number(ttsId) },
      data: { isbuy: buyorsold },
    });
    res.json({ ok: true });
  } else {
    const isBuy = await client.talkToSeller.update({
      where: { id: Number(ttsId) },
      data: { issold: buyorsold },
    });
    res.json({ ok: true });
  }
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
