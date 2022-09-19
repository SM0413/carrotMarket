import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { IResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponseType>
) {
  const {
    session: { user },
    body: { name, price, description },
  } = req;
  if (req.method === "POST") {
    const {
      result: {
        uid,
        rtmps: { streamKey, url },
      },
    } = await (
      await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ID}/stream/live_inputs`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.CF_STREAM_TOKEN}`,
          },
          body: `{"meta": {"name":"${name}"},"recording": { "mode": "automatic", "timeoutSeconds": 10}}`,
        }
      )
    ).json();
    const { videoUID } = await (
      await fetch(
        `https://customer-m033z5x00ks6nunl.cloudflarestream.com/${uid}/lifecycle`
      )
    ).json();
    const stream = await client.stream.create({
      data: {
        cloudflareId: uid,
        cloudflareURL: url,
        cloudflareKey: streamKey,
        coverImg: `https://customer-m033z5x00ks6nunl.cloudflarestream.com/${videoUID}/thumbnails/thumbnail.jpg`,
        user: {
          connect: {
            id: user?.id,
          },
        },
        name,
        price,
        description,
      },
    });
    res.json({
      ok: true,
      stream,
    });
  }
  if (req.method === "GET") {
    const streams = await client.stream.findMany({
      take: 25,
      /* 
      skip : 25 ==> 앞 25개 제외한 나머지 출력 ex)1번페이지에 25개 였다면 2번페이지 는 26~50 3번 페이지는 51~75번째 데이터를 불러옴 해당 기능을 위해서는
      1번 페이지 : take : 25 
      2번 페이지 : take : 25, skip : 25
      3번 페이지 : take : 25, skip : 50
      위와 같이 작성 할 수 있음
      */
    });

    res.json({ ok: true, streams });
  }
}
export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
