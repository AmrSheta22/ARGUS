import { createFileRoute, Outlet } from "@tanstack/react-router";

import Header from "../../components/marketing/header";

export const Route = createFileRoute("/_public")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
}
