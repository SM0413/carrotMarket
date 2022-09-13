import client from "@libs/server/client";
import withHandler from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { phone, email } = req.body;
  const payload = phone ? { phone: +phone } : { email };
  const token = await client.token.create({
    data: {
      payload: "6789",
      user: {
        connectOrCreate: {
          where: {
            ...payload,
          },
          create: {
            ...payload,
            name: "알수없음",
          },
        },
      },
    },
  });

  /* if (email) {
    user = await client.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      user = await client.user.create({
        data: {
          name: "Anonymous",
          email,
        },
      });
    }
  }
  if (phone) {
    user = await client.user.findUnique({
      where: {
        phone: +phone,
      },
    });
    if (!user) {
      user = await client.user.create({
        data: {
          name: "Anonymous",
          phone: +phone,
        },
      });
    }
  } */
  res.status(200).end();
}

export default withHandler("POST", handler);
