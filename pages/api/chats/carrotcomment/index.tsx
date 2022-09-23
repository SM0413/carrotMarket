import client from "@libs/server/client";
import withHandler, { IResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponseType>
) {
  const {
    query: { productId, buyerId, sellerId },
  } = req;

  const carrotComment = await client.carrotComment.findFirst({
    where: {
      productId: Number(productId),
      carrotcommentbuyerId: Number(buyerId),
      carrotcommentsellerId: Number(sellerId),
    },
  });

  res.json({ ok: true, carrotComment });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
