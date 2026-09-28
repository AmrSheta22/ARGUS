import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/")({
  component: HomePage,
});

function HomePage() {
  return <div>Hello World</div>;
}
