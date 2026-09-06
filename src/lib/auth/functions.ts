import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { getRequest, setResponseHeader } from "@tanstack/react-start/server";

import { auth } from "#/lib/auth/auth.ts";

export const $getSession = createServerFn({ method: "GET" }).handler(async () => {
  const user = await _getSession();
  return user;
});

interface GetSessionServerQuery {
  disableCookieCache?: boolean | undefined;
  disableRefresh?: boolean | undefined;
}

export const _getSession = createServerOnlyFn(async (query?: GetSessionServerQuery) => {
  const session = await auth.api.getSession({
    headers: getRequest().headers,
    query,
    returnHeaders: true,
  });

  // Forward any Set-Cookie headers to the client, e.g. for session/cache refresh
  const cookies = session.headers?.getSetCookie();
  if (cookies?.length) {
    setResponseHeader("Set-Cookie", cookies);
  }

  return session.response || null;
});
