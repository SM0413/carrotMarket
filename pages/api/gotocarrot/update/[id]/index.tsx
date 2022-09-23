import client from "@libs/server/client";
import withHandler, { IResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponseType>
) {
  const {
    query: { id: carrotId },
    body: { year, month, day, hour, min },
  } = req;
  const updateCarrot = await client.isCarrot.update({
    where: {
      id: Number(carrotId),
    },
    data: {
      meetTime:
        year + "-" + month + "-" + day + "T" + hour + ":" + min + ":00.000Z",
      // 2022-09-22T04:27:58.258Z
    },
  });
  res.json({ ok: true });

  return;
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
