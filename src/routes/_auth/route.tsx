import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { authQueryOptions } from "#/lib/auth/queries.ts";

/**
 * This is the _auth layout, which enables 'protected routes'
 * for all child routes under _auth (e.g. _auth/app/*)
 */
export const Route = createFileRoute("/_auth")({
  component: Outlet,
  ssr: false,
  beforeLoad: async ({ context }) => {
    /**
     * beforeLoad runs on every navigation and prefetch, so we use TanStack Query
     * for client-side caching to speed up navigation, reducing client-to-server calls.
     *
     * Better Auth's cookieCache is also enabled in `/lib/auth/auth.ts`,
     * which can further reduce server-to-database calls.
     *
     * Both cache layers help for faster UX and page load/navigation.
     *
     * But this is NOT a server-side security guarantee.
     * Consider authMiddleware for data fetching operations & mutations
     * where auth is required, e.g. for API routes and server functions.
     * see `/lib/auth/middleware.ts`
     */
    const session = await context.queryClient.query({
      ...authQueryOptions(),
      staleTime: "static",
    });
    void context.queryClient.query(authQueryOptions());

    if (!session) {
      throw redirect({ to: "/login" });
    }

    return {
      session,
    };
  },
});
