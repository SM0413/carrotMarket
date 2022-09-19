import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { IResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponseType>
) {
  const {
    query: { id },
    session: { user },
  } = req;

  const streamUserId = await client.stream.findUnique({
    where: {
      id: Number(id),
    },
    select: {
      userId: true,
    },
  });
  const stream = await client.stream.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      messages: {
        select: {
          id: true,
          message: true,
          user: {
            select: {
              avatar: true,
              id: true,
            },
          },
        },
      },
    },
  });
  if (!stream) {
    res.json({ ok: false });
  }
  const isOwner = stream?.userId === user?.id;

  if (stream && !isOwner) {
    stream.cloudflareKey = "================";
    stream.cloudflareURL = "================";
  }

  res.json({ ok: true, stream: stream });
}
export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
