import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}

const cookeOptions = {
  cookieName: "carrotSession",
  password: process.env.COOKIE_PASSWORD!,
};

export function withApiSession(fn: any) {
  return withIronSessionApiRoute(fn, cookeOptions);
}

export function withSsrSession(handler: any) {
  return withIronSessionSsr(handler, cookeOptions);
}
