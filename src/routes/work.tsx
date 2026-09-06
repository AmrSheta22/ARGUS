import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { cn } from "cn";
import { ArrowUpRightIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "#/components/ui/badge.tsx";
import { Button, buttonVariants } from "#/components/ui/button.tsx";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "#/components/ui/card.tsx";
import { Skeleton } from "#/components/ui/skeleton.tsx";
import { publishedWorkQueryOptions } from "#/features/content/queries.ts";
import type { Work } from "#/features/content/schemas.ts";

export const Route = createFileRoute("/work")({
  loader: ({ context }) => context.queryClient.ensureQueryData(publishedWorkQueryOptions()),
  component: WorkPage,
});

function WorkPage() {
  const { data, isPending, isError, refetch } = useQuery(publishedWorkQueryOptions());

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-6xl flex-col bg-background px-6 py-10 sm:py-14">
      <header className="flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <span aria-hidden="true" className="size-2 bg-primary" />
          <span className="font-heading text-sm font-semibold tracking-[0.3em] uppercase">
            ARGUS
          </span>
        </Link>
      </header>

      <section className="mt-16 flex flex-col gap-4 sm:mt-20">
        <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Our work</h1>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
          Research work by the ARGUS NLP Group.
        </p>
      </section>

      {isPending ? (
        <WorkSkeletons />
      ) : isError || !data ? (
        <div className="mt-12 flex flex-col items-center gap-3 rounded-none border border-dashed p-10 text-center">
          <p className="text-sm text-muted-foreground">Failed to load research work.</p>
          <Button variant="outline" size="sm" onClick={() => void refetch()}>
            Retry
          </Button>
        </div>
      ) : data.length === 0 ? (
        <div className="mt-12 flex flex-col items-center gap-2 rounded-none border border-dashed p-10 text-center">
          <p className="text-sm text-muted-foreground">No research work published yet.</p>
        </div>
      ) : (
        <div className="mt-10 flex flex-col gap-10">
          <FeaturedWork item={data[0]} />

          {data.length > 1 ? (
            <section className="flex flex-col gap-5">
              <SectionLabel>All publications</SectionLabel>
              <div className="columns-1 gap-4 md:columns-2">
                {data.slice(1).map((item) => (
                  <WorkCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      )}
    </div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <h2 className="font-heading text-[11px] font-medium tracking-[0.25em] text-muted-foreground uppercase">
        {children}
      </h2>
      <span className="h-px flex-1 bg-border" aria-hidden="true" />
    </div>
  );
}

function FeaturedWork({ item }: { item: Work }) {
  return (
    <section className="flex flex-col gap-3">
      <SectionLabel>Featured</SectionLabel>
      <Card className="ring-primary/60">
        <CardHeader className="gap-3">
          <WorkKicker area={item.area} />
          <CardTitle className="max-w-3xl text-2xl leading-snug font-semibold tracking-tight text-balance sm:text-3xl">
            {item.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {item.authors.length > 0 ? (
            <p className="text-xs text-muted-foreground">{item.authors.join(", ")}</p>
          ) : null}
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
            {item.abstract}
          </p>
        </CardContent>
        <CardFooter className="flex-wrap justify-between gap-3">
          <WorkMeta item={item} />
          {item.url ? <ReadMoreLink item={item} size="default" /> : null}
        </CardFooter>
      </Card>
    </section>
  );
}

function WorkCard({ item }: { item: Work }) {
  return (
    <Card className="mb-4 break-inside-avoid transition-colors hover:ring-foreground/25">
      <CardHeader className="gap-1.5">
        <WorkKicker area={item.area} />
        <CardTitle className="leading-snug font-semibold tracking-tight text-balance">
          {item.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {item.authors.length > 0 ? (
          <p className="text-xs text-muted-foreground">{item.authors.join(", ")}</p>
        ) : null}
        <p className="leading-relaxed text-muted-foreground">{item.abstract}</p>
      </CardContent>
      <CardFooter className="flex-wrap justify-between gap-3">
        <WorkMeta item={item} />
        {item.url ? <ReadMoreLink item={item} size="sm" /> : null}
      </CardFooter>
    </Card>
  );
}

function WorkKicker({ area, className }: { area: string; className?: string }) {
  return (
    <p
      className={cn(
        "flex items-center gap-1.5 font-heading text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase",
        className,
      )}
    >
      <span aria-hidden="true" className="size-1 bg-primary" />
      {area}
    </p>
  );
}

function WorkMeta({ item, className }: { item: Work; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      <Badge variant="outline">{item.code}</Badge>
      <Badge variant="secondary">{item.year}</Badge>
      {item.status ? <Badge variant="outline">{item.status}</Badge> : null}
    </div>
  );
}

function ReadMoreLink({ item, size = "sm" }: { item: Work; size?: "sm" | "default" }) {
  return (
    <a
      href={item.url ?? "#"}
      target="_blank"
      rel="noreferrer"
      className={cn(buttonVariants({ variant: "outline", size }), "group/link")}
    >
      Read more
      <ArrowUpRightIcon className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
    </a>
  );
}

function WorkSkeletons() {
  return (
    <div className="mt-10 flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-px flex-1" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-px flex-1" />
        </div>
        <div className="columns-1 gap-4 md:columns-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="mb-4 h-44 w-full break-inside-avoid" />
          ))}
        </div>
      </div>
    </div>
  );
}
