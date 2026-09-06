import { Link } from "@tanstack/react-router";
import { BriefcaseIcon, LayoutDashboardIcon, VideoIcon } from "lucide-react";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "#/components/ui/sidebar.tsx";
import type { Session } from "#/lib/auth/types.ts";

import { NavUser } from "./nav-user";

const navItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboardIcon,
    to: "/admin",
  },
  {
    label: "Work",
    icon: BriefcaseIcon,
    to: "/admin/work",
  },
  {
    label: "Videos",
    icon: VideoIcon,
    to: "/admin/videos",
  },
] as const;

export function AdminSidebar({
  session,
  pathname,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  session: Session;
  pathname: string;
}) {
  const { user } = session;
  return (
    <Sidebar {...props}>
      <SidebarHeader>ARGUS</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton
                    render={
                      <Link to={item.to}>
                        <item.icon aria-hidden="true" />
                        <span>{item.label}</span>
                      </Link>
                    }
                    isActive={item.to === pathname}
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
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
