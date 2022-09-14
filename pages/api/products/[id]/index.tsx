import client from "@libs/server/client";
import withHandler, { IResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponseType>
) {
  const {
    query: { id },
    session: { user },
  } = req;
  const product = await client.product.findUnique({
    where: { id: Number(id) },
    include: { user: { select: { id: true, name: true, avatar: true } } },
  });

  const terms = product?.name
    .split(" ")
    .map((word) => ({ name: { contains: word } }));

  const relatedProducts = await client.product.findMany({
    where: {
      OR: terms,
      AND: {
        id: {
          not: Number(id),
        },
      },
    },
  });
  const isLiked = Boolean(
    await client.fav.findFirst({
      where: { productId: Number(id), userId: user?.id },
      select: { id: true },
    })
  );
  res.json({ ok: true, product, isLiked, relatedProducts });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
