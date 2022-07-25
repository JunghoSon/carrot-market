import withHandler, { ResponseType } from "libs/server/withHandler";
import client from "libs/server/client";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "libs/server/withApiSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const streams = await client.stream.findMany({
      // take: 10,
      // skip: 10,
    });
    res.json({ ok: true, streams });
  } else if (req.method === "POST") {
    const {
      session: { user },
      body: { name, price, description },
    } = req;
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
            body: `{"meta": {"name":"${name}"},"recording": { "mode": "automatic", "timeoutSeconds": 10}}`,
          },
        }
      )
    ).json();

    const stream = await client.stream.create({
      data: {
        name,
        price,
        description,
        cloudflareId: uid,
        cloudflareKey: streamKey,
        cloudflareUrl: url,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });

    res.json({ ok: true, stream });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
    isPrivate: false,
  })
);
