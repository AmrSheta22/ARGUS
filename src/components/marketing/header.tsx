import { Link } from "@tanstack/react-router";

import { UserMenu } from "#/components/admin/nav-user.tsx";
import { Button, buttonVariants } from "#/components/ui/button.tsx";
import { useAuth } from "#/lib/auth/hooks.ts";
import { cn } from "#/lib/utils.ts";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import { MobileNav } from "./mobile-nav";

export const navItems = [
  { label: "Work", to: "/work" },
  { label: "Summaries", to: "/summaries" },
  { label: "Videos", to: "/videos" },
  { label: "Knowledge", to: "/knowledge" },
] as const;

export default function Header() {
  const { user: session } = useAuth();

  return (
    <header className={cn("sticky top-0 z-50 w-full border-b border-border bg-background")}>
      <nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
        <Link className={navigationMenuTriggerStyle()} to="/">
          ARGUS
        </Link>
        <NavigationMenu className="hidden items-center gap-2 md:flex">
          <NavigationMenuList>
            {navItems.map((link) => (
              <NavigationMenuItem>
                <NavigationMenuLink
                  key={link.label}
                  className={navigationMenuTriggerStyle()}
                  render={<Link to={link.to} />}
                >
                  {link.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="hidden items-center gap-2 md:flex">
          {session ? (
            <UserMenu
              compact
              render={<Button className="rounded-full" size="icon-lg" variant="ghost" />}
              user={session.user}
            />
          ) : (
            <>
              <Link className={buttonVariants({ variant: "ghost" })} to="/login">
                Login
              </Link>
              <Link className={buttonVariants()} to="/signup">
                Get Started
              </Link>
            </>
          )}
        </div>
        <MobileNav />
      </nav>
    </header>
  );
}
