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
  const alreayExists = await client.fav.findFirst({
    where: {
      productId: Number(id),
      userId: user?.id,
    },
  });
  if (alreayExists) {
    await client.fav.delete({ where: { id: alreayExists.id } });
  } else {
    await client.fav.create({
      data: {
        user: { connect: { id: user?.id } },
        product: { connect: { id: Number(id) } },
      },
    });
  }
  res.json({ ok: true });
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
