import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/admin/videos")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_auth/admin/videos"!</div>;
}
