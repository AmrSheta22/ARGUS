import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/admin")({
  component: RouteComponent,
  beforeLoad: () => {
    // TODO: check for admin role
  },
});

function RouteComponent() {
  return <Outlet />;
}
