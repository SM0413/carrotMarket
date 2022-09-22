import client from "@libs/server/client";
import withHandler, { IResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponseType>
) {
  if (req.method === "GET") {
    const {
      query: { sellerId, buyerId, id: ttsId, productId },
      session: { user },
    } = req;
    console.log(sellerId, buyerId, ttsId);
    const alreadyCarrot = await client.isCarrot.findFirst({
      where: {
        ttsId: Number(ttsId),
        carrotsellerId: Number(sellerId),
        carrotbuyerId: Number(buyerId),
      },
      select: {
        id: true,
      },
    });
    console.log("alreadyCarrot=>");
    console.log(alreadyCarrot);
    if (alreadyCarrot) {
      const findCarrotData = await client.isCarrot.findUnique({
        where: {
          id: alreadyCarrot?.id,
        },
        select: {
          id: true,
          meetTime: true,
        },
      });
      console.log("findCarrotData=>");
      console.log(findCarrotData);
      res.json({ ok: true, findCarrotData });
    } else {
      const createCarrot = await client.isCarrot.create({
        data: {
          product: { connect: { id: Number(productId) } },
          seller: { connect: { id: Number(sellerId) } },
          buyer: { connect: { id: Number(buyerId) } },
          tts: { connect: { id: Number(ttsId) } },
        },
        select: {
          id: true,
          meetTime: true,
        },
      });
      console.log("데이터 생성 완료");
    }
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);
