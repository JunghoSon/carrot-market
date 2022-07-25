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
    body: { answer },
  } = req;
  const newAnswer = await client.answer.create({
    data: {
      answer,
      user: {
        connect: {
          id: user?.id,
        },
      },
      post: {
        connect: {
          id: +id.toString(),
        },
      },
    },
  });
  res.json({
    ok: true,
    newAnswer,
  });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
