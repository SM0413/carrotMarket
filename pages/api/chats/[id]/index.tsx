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
    query: { id, sellerId },
  } = req;
  const findTalkToSeller = await client.talkToSeller.findFirst({
    where: {
      productId: Number(id),
    },
    select: {
      id: true,
    },
  });
  if (findTalkToSeller === null) {
    console.log("create");
    const createTalkToSeller = await client.talkToSeller.create({
      data: {
        product: {
          connect: {
            id: Number(id),
          },
        },
        buyer: {
          connect: {
            id: user?.id,
          },
        },
        seller: {
          connect: {
            id: Number(sellerId),
          },
        },
      },
    });
    if (createTalkToSeller) {
      res.json({ ok: true, createTalkToSeller });
    } else {
      res.json({ ok: false });
    }
  } else if (findTalkToSeller !== null) {
    const findTalkToSellerUniq = await client.talkToSeller.findUnique({
      where: {
        id: findTalkToSeller.id,
      },
      select: {
        id: true,
        createdBuyerId: true,
        createdSellerId: true,
        isbuy: true,
        issold: true,
        product: {
          select: {
            id: true,
            image: true,
            price: true,
            description: true,
            name: true,
          },
        },
        messages: {
          select: {
            userId: true,
            message: true,
            talktosellerId: true,
            user: {
              select: {
                id: true,
                avatar: true,
              },
            },
          },
        },
      },
    });
    res.json({ ok: true, findTalkToSellerUniq });
  } else {
    res.json({ ok: false });
  }
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
