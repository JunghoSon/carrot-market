import withHandler, { ResponseType } from "libs/server/withHandler";
import client from "libs/server/client";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "libs/server/withApiSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const profile = await client.user.findUnique({
      where: { id: req.session.user?.id },
    });
    res.json({
      ok: true,
      profile,
    });
  }

  if (req.method === "POST") {
    const {
      session: { user },
      body: { email, phone, name, avatarId },
    } = req;

    if (name) {
      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          name,
        },
      });
    }

    if (avatarId) {
      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          avatar: avatarId,
        },
      });
    }

    const currentUser = await client.user.findUnique({
      where: {
        id: user?.id,
      },
    });

    if (email && email !== currentUser?.email) {
      const aleadyExists = Boolean(
        await client.user.findUnique({
          where: {
            email,
          },
        })
      );
      if (aleadyExists) {
        return res.json({
          ok: false,
          error: "Email aleady taken.",
        });
      }
      await client.user.update({
        where: { id: user?.id },
        data: {
          email,
        },
      });
      return res.json({
        ok: true,
      });
    }

    if (phone && phone !== currentUser?.phone) {
      const aleadyExists = Boolean(
        await client.user.findUnique({
          where: {
            phone,
          },
        })
      );
      if (aleadyExists) {
        return res.json({
          ok: false,
          error: "Phone number aleady in use.",
        });
      }
      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          phone,
        },
      });
      return res.json({
        ok: true,
      });
    }

    res.json({ ok: true });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
