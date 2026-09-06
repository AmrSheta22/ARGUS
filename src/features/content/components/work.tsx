import { cn } from "cn";

import { Badge } from "#/components/ui/badge.tsx";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "#/components/ui/card.tsx";
import { Skeleton } from "#/components/ui/skeleton.tsx";
import { workStatusLabel } from "#/consts/content.ts";

import type { Work } from "../schemas.ts";
import { ReadMoreLink, SectionLabel } from "./shared.tsx";

export function FeaturedWork({ item }: { item: Work }) {
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
          {item.url ? <ReadMoreLink url={item.url} size="default" /> : null}
        </CardFooter>
      </Card>
    </section>
  );
}

export function WorkCard({ item }: { item: Work }) {
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
        {item.url ? <ReadMoreLink url={item.url} size="sm" /> : null}
      </CardFooter>
    </Card>
  );
}

export function WorkKicker({ area, className }: { area: string; className?: string }) {
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

export function WorkMeta({ item, className }: { item: Work; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      <Badge variant="outline">{item.code}</Badge>
      <Badge variant="secondary">{item.year}</Badge>
      {item.status ? <Badge variant="outline">{workStatusLabel(item.status)}</Badge> : null}
    </div>
  );
}

export function WorkSkeletons() {
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
