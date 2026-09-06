import { Badge } from "#/components/ui/badge.tsx";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "#/components/ui/card.tsx";
import { Skeleton } from "#/components/ui/skeleton.tsx";

import type { Summary } from "../schemas.ts";
import { splitTags } from "../utils.ts";
import { ReadMoreLink, SectionLabel } from "./shared.tsx";

export function FeaturedSummary({ item }: { item: Summary }) {
  const tags = splitTags(item.tags);

  return (
    <section className="flex flex-col gap-3">
      <SectionLabel>Featured</SectionLabel>
      <Card className="ring-primary/60">
        <CardHeader className="gap-3">
          <CardTitle className="max-w-3xl text-2xl leading-snug font-semibold tracking-tight text-balance sm:text-3xl">
            {item.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {item.subtitle ? <p className="text-xs text-muted-foreground">{item.subtitle}</p> : null}
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
            {item.description}
          </p>
        </CardContent>
        <SummaryFooter item={item} tags={tags} />
      </Card>
    </section>
  );
}

export function SummaryCard({ item }: { item: Summary }) {
  const tags = splitTags(item.tags);

  return (
    <Card className="mb-4 break-inside-avoid transition-colors hover:ring-foreground/25">
      <CardHeader className="gap-1.5">
        <CardTitle className="leading-snug font-semibold tracking-tight text-balance">
          {item.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {item.subtitle ? <p className="text-xs text-muted-foreground">{item.subtitle}</p> : null}
        <p className="leading-relaxed text-muted-foreground">{item.description}</p>
      </CardContent>
      <SummaryFooter item={item} tags={tags} linkSize="sm" />
    </Card>
  );
}

function SummaryFooter({
  item,
  tags,
  linkSize = "default",
}: {
  item: Summary;
  tags: string[];
  linkSize?: "sm" | "default";
}) {
  if (tags.length === 0 && !item.url) return null;
  return (
    <CardFooter className="flex-wrap justify-between gap-3">
      <SummaryMeta item={item} tags={tags} />
      {item.url ? <ReadMoreLink url={item.url} size={linkSize} /> : null}
    </CardFooter>
  );
}

export function SummaryMeta({ item, tags }: { item: Summary; tags?: string[] }) {
  const resolved = tags ?? splitTags(item.tags);
  if (resolved.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {resolved.map((tag) => (
        <Badge key={tag} variant="outline">
          {tag}
        </Badge>
      ))}
    </div>
  );
}

export function SummarySkeletons() {
  return (
    <div className="mt-10 flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-px flex-1" />
        </div>
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-px flex-1" />
        </div>
        <div className="columns-1 gap-4 md:columns-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="mb-4 flex break-inside-avoid flex-col gap-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
