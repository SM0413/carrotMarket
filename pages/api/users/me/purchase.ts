import client from "@libs/server/client";
import withHandler, { IResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";
import products from "pages/api/products";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponseType>
) {
  if (req.method === "GET") {
    const {
      session: { user },
    } = req;
    const purchase = await client.purchase.findMany({
      where: {
        userId: user?.id,
      },
      include: {
        product: {
          include: {
            _count: {
              select: {
                fav: true,
              },
            },
          },
        },
      },
    });
    res.json({ ok: true, purchase });
  } else if (req.method === "POST") {
    const {
      session: { user },
      body: { productId },
    } = req;
    const alreadyPurchase = await client.purchase.findFirst({
      where: {
        productId: Number(productId),
        userId: user?.id,
      },
      select: {
        id: true,
      },
    });
    if (!alreadyPurchase) {
      await client.purchase.create({
        data: {
          user: {
            connect: {
              id: user?.id,
            },
          },
          product: {
            connect: {
              id: Number(productId),
            },
          },
        },
      });
      res.json({ ok: true });
    }
    res.json({ ok: false });
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);
