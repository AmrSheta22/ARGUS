import { cn } from "cn";
import { ArrowUpRightIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Button, buttonVariants } from "#/components/ui/button.tsx";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader } from "#/components/ui/empty.tsx";

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <h2 className="text-muted-foreground">{children}</h2>
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
    <div className="typeset mx-auto flex w-full max-w-4xl flex-1 flex-col py-8">
      <section>
        <h1 className="text-balance">{title}</h1>
        <p className="max-w-xl text-pretty text-muted-foreground">{description}</p>
      </section>
      {children}
    </div>
  );
}

export function ContentStack({ children }: { children: ReactNode }) {
  return <div className="flex flex-col">{children}</div>;
}

export function ContentSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-5">
      <SectionLabel>{label}</SectionLabel>
      {children}
    </section>
  );
}

export function ContentGrid({ children }: { children: ReactNode }) {
  return <div className="columns-1 gap-2 md:columns-2">{children}</div>;
}

export function ContentErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Empty className="not-typeset">
      <EmptyHeader>
        <EmptyDescription>{message}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      </EmptyContent>
    </Empty>
  );
}

export function ContentEmptyState({ message }: { message: string }) {
  return (
    <Empty className="not-typeset">
      <EmptyHeader>
        <EmptyDescription>{message}</EmptyDescription>
      </EmptyHeader>
    </Empty>
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
