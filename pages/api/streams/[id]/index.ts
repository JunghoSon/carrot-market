import withHandler, { ResponseType } from "libs/server/withHandler";
import client from "libs/server/client";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "libs/server/withApiSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
    session: { user },
  } = req;

  const stream = await client.stream.findUnique({
    where: {
      id: +id.toString(),
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
  const isOwner = stream?.userId === user?.id;
  if (stream && !isOwner) {
    stream.cloudflareKey = "xxxxxx";
    stream.cloudflareUrl = "xxxxxx";
  }
  res.json({ ok: true, stream });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
    isPrivate: false,
  })
);
