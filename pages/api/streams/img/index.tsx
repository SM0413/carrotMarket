import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { IResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponseType>
) {
  const {
    body: { id },
  } = req;

  const stream = await client.stream.findUnique({
    where: {
      id: Number(id),
    },
    select: {
      cloudflareId: true,
    },
  });

  const uriId = await (
    await fetch(
      `https://customer-m033z5x00ks6nunl.cloudflarestream.com/${stream?.cloudflareId}/lifecycle`
    )
  ).json();

  const UploadIMG = await client.stream.update({
    where: {
      id: Number(id),
    },
    data: {
      coverImg: `https://customer-m033z5x00ks6nunl.cloudflarestream.com/${uriId.videoUID}/thumbnails/thumbnail.jpg`,
    },
  });

  res.json({ ok: true });
}
export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
