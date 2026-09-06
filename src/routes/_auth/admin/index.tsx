import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/admin/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>If you can view this page, you're an admin!</div>;
}
