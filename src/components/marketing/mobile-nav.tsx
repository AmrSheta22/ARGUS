import { Link } from "@tanstack/react-router";
import { XIcon, MenuIcon } from "lucide-react";
import React from "react";

import { UserMenu } from "#/components/admin/nav-user.tsx";
import { Button, buttonVariants } from "#/components/ui/button.tsx";
import { Portal, PortalBackdrop } from "#/components/ui/portal.tsx";
import { useAuth } from "#/lib/auth/hooks.ts";
import { cn } from "#/lib/utils.ts";

import { navItems } from "./header";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const { user: session } = useAuth();

  return (
    <div className="md:hidden">
      <Button
        aria-controls="mobile-menu"
        aria-expanded={open}
        aria-label="Toggle menu"
        className="md:hidden"
        onClick={() => setOpen(!open)}
        size="icon"
        variant="outline"
      >
        {open ? <XIcon className="size-4.5" /> : <MenuIcon className="size-4.5" />}
      </Button>
      {open && (
        <Portal className="top-14" id="mobile-menu">
          <PortalBackdrop />
          <div
            className="flex size-full flex-col p-4 ease-out data-[slot=open]:animate-in data-[slot=open]:zoom-in-97"
            data-slot={open ? "open" : "closed"}
          >
            <div className="grid flex-1 content-start gap-y-2">
              {navItems.map((link) => (
                <Link
                  key={link.label}
                  className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}
                  onClick={() => setOpen(false)}
                  to={link.to}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-auto flex flex-col gap-2">
              {session ? (
                <UserMenu onSignOut={() => setOpen(false)} user={session.user} />
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className={cn(buttonVariants({ variant: "outline" }), "w-full")}
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setOpen(false)}
                    className={cn(buttonVariants(), "w-full")}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
