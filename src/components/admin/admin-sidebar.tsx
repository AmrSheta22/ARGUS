import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "#/components/ui/sidebar.tsx";
import type { Session } from "#/lib/auth/types.ts";

import { NavUser } from "./nav-user";

export function AdminSidebar({
  session,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  session: Session;
}) {
  const { user } = session;
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>ARGUS</SidebarHeader>
      <SidebarContent></SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user.name,
            email: user.email,
            avatar: user.image ?? "",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
