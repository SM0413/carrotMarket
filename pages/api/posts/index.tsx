import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { IResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponseType>
) {
  if (req.method === "POST") {
    const {
      body: { question, latitude, longitude },
      session: { user },
    } = req;
    const post = await client.post.create({
      data: {
        question,
        latitude,
        longitude,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    await res.revalidate("/community");
    res.json({
      ok: true,
      post,
    });
  }
  if (req.method === "GET") {
    const {
      query: { latitude, longitude },
    } = req;
    const latitudeNumber = parseFloat(String(latitude));
    const longitudeNumber = parseFloat(String(longitude));
    const posts = await client.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            wondering: true,
            answers: true,
          },
        },
      },
      where: {
        latitude: {
          gte: latitudeNumber - 0.01,
          lte: latitudeNumber + 0.01,
        },
        longitude: {
          gte: longitudeNumber - 0.01,
          lte: longitudeNumber + 0.01,
        },
      },
    });
    res.json({
      ok: true,
      posts,
    });
  }
}
export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
