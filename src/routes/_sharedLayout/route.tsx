import { createFileRoute, Outlet } from "@tanstack/react-router";

import Header from "../../components/marketing/header";

export const Route = createFileRoute("/_sharedLayout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  );
}
