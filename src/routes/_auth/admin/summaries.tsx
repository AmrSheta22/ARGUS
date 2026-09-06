import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/admin/summaries")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_auth/admin/summaries"!</div>;
}
