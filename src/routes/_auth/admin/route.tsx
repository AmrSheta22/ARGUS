import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { AdminSidebar } from "../../../components/admin/admin-sidebar";
import { SidebarInset, SidebarProvider } from "../../../components/ui/sidebar";

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
  const { session } = Route.useRouteContext();
  return (
    <SidebarProvider>
      <AdminSidebar session={session} />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
