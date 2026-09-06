import { cn } from "cn";
import { PlayIcon } from "lucide-react";

import { Badge } from "#/components/ui/badge.tsx";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "#/components/ui/card.tsx";
import { Skeleton } from "#/components/ui/skeleton.tsx";
import { formatDuration } from "#/consts/content.ts";

import type { Video } from "../schemas.ts";
import { parseVideoSource } from "../utils.ts";
import { SectionLabel } from "./shared.tsx";

export function FeaturedVideo({ item }: { item: Video }) {
  return (
    <section className="flex flex-col gap-3">
      <SectionLabel>Featured</SectionLabel>
      <Card className="ring-primary/60">
        <CardHeader className="gap-3">
          <VideoKicker topic={item.topic} />
          <CardTitle className="max-w-3xl text-2xl leading-snug font-semibold tracking-tight text-balance sm:text-3xl">
            {item.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <VideoSource item={item} />
          {item.source ? <p className="text-xs text-muted-foreground">{item.source}</p> : null}
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
            {item.description}
          </p>
        </CardContent>
        <VideoMeta item={item} />
      </Card>
    </section>
  );
}

export function VideoCard({ item }: { item: Video }) {
  return (
    <Card className="mb-4 break-inside-avoid transition-colors hover:ring-foreground/25">
      <CardHeader className="gap-1.5">
        <VideoKicker topic={item.topic} />
        <CardTitle className="leading-snug font-semibold tracking-tight text-balance">
          {item.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <VideoSource item={item} />
        {item.source ? <p className="text-xs text-muted-foreground">{item.source}</p> : null}
        <p className="leading-relaxed text-muted-foreground">{item.description}</p>
      </CardContent>
      <VideoMeta item={item} />
    </Card>
  );
}

export function VideoKicker({ topic, className }: { topic: string; className?: string }) {
  if (!topic) return null;
  return (
    <p
      className={cn(
        "flex items-center gap-1.5 font-heading text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase",
        className,
      )}
    >
      <span aria-hidden="true" className="size-1 bg-primary" />
      {topic}
    </p>
  );
}

export function VideoMeta({ item, className }: { item: Video; className?: string }) {
  const duration = formatDuration(item.durationMinutes);
  if (!duration) return null;
  return (
    <CardFooter className={cn("flex-wrap justify-between gap-3", className)}>
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant="secondary">{duration}</Badge>
      </div>
    </CardFooter>
  );
}

export function VideoSource({ item }: { item: Video }) {
  const parsed = parseVideoSource(item.url);
  if (!parsed) return null;

  if (parsed.kind === "iframe") {
    return (
      <iframe
        src={parsed.src}
        title={item.title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="aspect-video w-full border-0 bg-muted"
      />
    );
  }

  if (parsed.kind === "file") {
    return (
      // oxlint-disable-next-line jsx-a11y/media-has-caption
      <video
        src={item.url}
        controls
        preload="metadata"
        playsInline
        className="aspect-video w-full bg-muted"
      />
    );
  }

  return (
    <a
      href={parsed.href}
      target="_blank"
      rel="noreferrer"
      className="flex aspect-video w-full flex-col items-center justify-center gap-2 bg-muted text-muted-foreground transition-colors hover:bg-muted/70"
    >
      <PlayIcon className="size-6" aria-hidden="true" />
      <span className="font-heading text-[10px] font-medium tracking-[0.2em] uppercase">
        Watch video
      </span>
    </a>
  );
}

export function VideoSkeletons() {
  return (
    <div className="mt-10 flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-px flex-1" />
        </div>
        <Skeleton className="aspect-video h-auto w-full" />
        <Skeleton className="h-5 w-2/3" />
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
              <Skeleton className="aspect-video h-auto w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
