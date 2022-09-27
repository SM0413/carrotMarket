import twilio from "twilio";
import client from "@libs/server/client";
import withHandler, { IResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import smtpTransport from "@libs/server/email";

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponseType>
) {
  const { phone, email } = req.body;
  const user = phone ? { phone: phone } : { email };
  if (!user) return res.status(500).json({ ok: false });
  const payload = Math.floor(100000 + Math.random() * 900000) + "";
  const token = await client.token.create({
    data: {
      payload,
      user: {
        connectOrCreate: {
          where: {
            ...user,
          },
          create: {
            ...user,
          },
        },
      },
    },
  });
  if (phone) {
    await twilioClient.messages.create({
      messagingServiceSid: process.env.MESSAGE_SERVICE_SID,
      to: "82" + phone,
      body: `From CarrotMarket => This is your Code : ${payload}`,
    });
  } else if (email) {
    const mailOptions = {
      from: "kbjtmdals@naver.com",
      to: email,
      subject: "CarrotMarket Code Email",
      text: `From CarrotMarket => This is your Code : ${payload}`,
    };
    const result = await smtpTransport.sendMail(
      mailOptions,
      (error, responses) => {
        if (error) {
          console.log(error);
          return null;
        } else {
          console.log(responses);
          return null;
        }
      }
    );
    smtpTransport.close();
  }
  return res.json({ ok: true });
}

export default withHandler({ methods: ["POST"], handler, isPrivate: false });
