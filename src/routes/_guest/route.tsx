import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";
import { z } from "zod";

import { authQueryOptions } from "#/lib/auth/queries.ts";

/**
 * `redirectUrl` is set by the `_auth` layout guard (and any other link) so that
 * after a successful login/signup the user is sent back where they were headed.
 * Only internal paths are accepted to avoid open redirects.
 */
const guestSearchSchema = z.object({
  redirectUrl: z
    .string()
    .refine(
      (value) =>
        value === "/" ||
        (value.startsWith("/") &&
          !value.startsWith("//") &&
          !value.includes("://") &&
          !value.includes("?") &&
          !value.includes("#")),
      "redirectUrl must be an internal path",
    )
    .catch("/")
    .default("/"),
});

export const Route = createFileRoute("/_guest")({
  component: RouteComponent,
  validateSearch: guestSearchSchema,
  beforeLoad: async ({ context, search }) => {
    // Already signed in, or landed here after a successful login/signup:
    // bounce to the requested (or default) destination instead of the auth page.
    const session = await context.queryClient.query({
      ...authQueryOptions(),
      staleTime: "static",
    });
    void context.queryClient.query(authQueryOptions());

    if (session) {
      throw redirect({
        to: search.redirectUrl,
      });
    }
  },
});

function RouteComponent() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6">
      <div className="flex w-full max-w-sm flex-col gap-2">
        <Link
          to="/"
          aria-label="ARGUS. home"
          className="mx-auto flex items-center gap-2 font-semibold tracking-tight"
        >
          ARGUS
        </Link>
        <Outlet />
      </div>
    </div>
  );
}
