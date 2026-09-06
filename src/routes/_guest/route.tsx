import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";

import { authQueryOptions } from "#/lib/auth/queries.ts";

export const Route = createFileRoute("/_guest")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    // Redirect path when session is already present,
    // or after successful login/signup
    const REDIRECT_URL = "/";

    const session = await context.queryClient.query({
      ...authQueryOptions(),
      staleTime: "static",
    });
    void context.queryClient.query(authQueryOptions());

    if (session) {
      throw redirect({
        to: REDIRECT_URL,
      });
    }

    return {
      redirectUrl: REDIRECT_URL,
    };
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
