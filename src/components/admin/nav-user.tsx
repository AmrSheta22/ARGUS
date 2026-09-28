import { Link } from "@tanstack/react-router";
import { ChevronsUpDownIcon, LogOutIcon, ShieldCheckIcon } from "lucide-react";
import type * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu.tsx";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "#/components/ui/sidebar.tsx";
import { useSignOut } from "#/lib/auth/hooks.ts";
import type { User } from "#/lib/auth/types.ts";
import { cn } from "#/lib/utils.ts";

function UserAvatar({ user }: { user: User }) {
  return (
    <Avatar>
      <AvatarImage src={user.image ?? undefined} alt={user.name} />
      <AvatarFallback>{user.name[0]}</AvatarFallback>
    </Avatar>
  );
}

function UserIdentity({ user }: { user: User }) {
  return (
    <div className="grid flex-1 text-left text-sm leading-tight">
      <span className="truncate font-medium">{user.name}</span>
      <span className="truncate text-xs">{user.email}</span>
    </div>
  );
}

/**
 * User dropdown without any sidebar dependency, so it can be rendered anywhere
 * (e.g. the marketing header). Use `NavUser` for the admin sidebar footer.
 *
 * `render` swaps the trigger for another element, e.g. `<Button />` or
 * `<SidebarMenuButton />`; pass `compact` for an avatar-only trigger.
 */
export function UserMenu({
  user,
  side = "bottom",
  align = "end",
  compact = false,
  render,
  className,
  onSignOut,
}: {
  user: User;
  side?: "bottom" | "right";
  align?: "start" | "end";
  compact?: boolean;
  render?: React.ReactElement;
  className?: string;
  onSignOut?: () => void;
}) {
  const { mutate: signOut } = useSignOut();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={compact ? `Account menu for ${user.name}` : undefined}
        className={cn(
          !compact && "flex items-center gap-2 text-left text-sm outline-none",
          // a custom `render` (e.g. `SidebarMenuButton`) brings its own surface styles
          !compact &&
            !render &&
            "w-full p-2 transition-colors hover:bg-muted focus-visible:ring-1 focus-visible:ring-ring/50 aria-expanded:bg-muted",
          className,
        )}
        render={render}
      >
        <UserAvatar user={user} />
        {!compact && (
          <>
            <UserIdentity user={user} />
            <ChevronsUpDownIcon className="ml-auto size-4" />
          </>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="md:w-fit" side={side} align={align} sideOffset={4}>
        <DropdownMenuGroup>
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <UserAvatar user={user} />
              <UserIdentity user={user} />
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {user.role === "admin" && (
          <DropdownMenuItem render={<Link to="/admin" />}>
            <ShieldCheckIcon aria-hidden="true" />
            Admin
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          variant="destructive"
          onClick={() => {
            onSignOut?.();
            signOut();
          }}
        >
          <LogOutIcon />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function NavUser({ user }: { user: User }) {
  const { isMobile } = useSidebar();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <UserMenu
          render={<SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />}
          side={isMobile ? "bottom" : "right"}
          user={user}
        />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
