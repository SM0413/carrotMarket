import client from "@libs/server/client";
import withHandler, { IResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";
//
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponseType>
) {
  if (req.method === "GET") {
    const {
      session: { user },
      query: { fromProduct, productId },
    } = req;
    if (fromProduct !== "true") {
      const AllChats = await client.talkToSeller.findMany({
        where: {
          OR: [
            {
              createdBuyerId: user?.id,
            },
            {
              createdSellerId: user?.id,
            },
          ],
        },
        select: {
          id: true,
          productId: true,
          isbuy: true,
          issold: true,
          createdSellerId: true,
          createdBuyerId: true,
          isSell: true,
          product: {
            select: {
              image: true,
              name: true,
              userId: true,
            },
          },
          messages: {
            select: {
              message: true,
              user: {
                select: {
                  avatar: true,
                  name: true,
                },
              },
            },
          },
        },
      });
      res.json({ ok: true, AllChats });
    } else {
      const findtts = await client.talkToSeller.findFirst({
        where: {
          productId: Number(productId),
          createdSellerId: user?.id,
        },
        select: {
          id: true,
        },
      });
      res.json({ ok: true, findtts });
    }
  }
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
