import client from "@libs/server/client";
import withHandler, { IResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";
import { userAgent } from "next/server";
import { start } from "repl";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponseType>
) {
  const {
    body: { comment, star },
    query: { id: isCarrotId, productId, buyerId, sellerId },
    session: { user },
  } = req;
  console.log(productId, buyerId, sellerId);
  console.log(comment);
  const alreadyCarrotComment = await client.carrotComment.findFirst({
    where: {
      productId: Number(productId),
      carrotcommentsellerId: Number(sellerId),
      carrotcommentbuyerId: Number(buyerId),
    },
    select: {
      id: true,
      carrotcommentbuyerId: true,
      carrotcommentsellerId: true,
    },
  });
  if (
    alreadyCarrotComment &&
    alreadyCarrotComment.carrotcommentbuyerId === user?.id
  ) {
    await client.carrotComment.update({
      where: {
        id: alreadyCarrotComment?.id,
      },
      data: {
        buyerComment: comment,
        starForBuyer: Number(star),
      },
    });
  } else if (
    alreadyCarrotComment &&
    alreadyCarrotComment.carrotcommentsellerId === user?.id
  ) {
    await client.carrotComment.update({
      where: {
        id: alreadyCarrotComment?.id,
      },
      data: {
        sellerComment: comment,
        starForSeller: Number(star),
      },
    });
  }
}

export default withApiSession(
  withHandler({ methods: ["POST", "GET"], handler })
);
