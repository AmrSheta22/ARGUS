import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/admin")({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (context.session.user.role !== "admin") {
      throw redirect({
        to: "/",
      });
    }
  },
});

function RouteComponent() {
  return <Outlet />;
}
