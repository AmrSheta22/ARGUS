import { cn } from "cn";
import { ArrowUpRightIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Button, buttonVariants } from "#/components/ui/button.tsx";

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <h2 className="font-heading text-[11px] font-medium tracking-[0.25em] text-muted-foreground uppercase">
        {children}
      </h2>
      <span className="h-px flex-1 bg-border" aria-hidden="true" />
    </div>
  );
}

export function ContentPage({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-6xl flex-col bg-background px-6 py-10">
      <section className="flex flex-col gap-4">
        <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">{description}</p>
      </section>
      {children}
    </div>
  );
}

export function ContentErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="mt-12 flex flex-col items-center gap-3 rounded-none border border-dashed p-10 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
}

export function ContentEmptyState({ message }: { message: string }) {
  return (
    <div className="mt-12 flex flex-col items-center gap-2 rounded-none border border-dashed p-10 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export function ReadMoreLink({
  url,
  size = "sm",
  label = "Read more",
  className,
}: {
  url: string;
  size?: "sm" | "default";
  label?: string;
  className?: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={cn(buttonVariants({ variant: "outline", size }), "group/link", className)}
    >
      {label}
      <ArrowUpRightIcon className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
    </a>
  );
}
