import { cn } from "cn";
import { PlayIcon } from "lucide-react";

import { Badge } from "#/components/ui/badge.tsx";
import { Card, CardContent, CardFooter, CardTitle } from "#/components/ui/card.tsx";
import { Skeleton } from "#/components/ui/skeleton.tsx";
import { formatDuration } from "#/consts/content.ts";

import type { Video } from "../schemas.ts";
import { parseVideoSource } from "../utils.ts";
import { SectionLabel } from "./shared.tsx";

export function FeaturedVideo({ item }: { item: Video }) {
  return (
    <section className="flex flex-col gap-3">
      <SectionLabel>Featured</SectionLabel>
      <Card className="py-0 ring-primary/60">
        <CardContent className="grid gap-0 p-0 md:grid-cols-2">
          <div className="order-last flex flex-col justify-center gap-3 p-(--card-spacing) md:order-first">
            <VideoKicker topic={item.topic} />
            <CardTitle className="max-w-3xl text-xl font-semibold text-balance">
              {item.title}
            </CardTitle>
            {item.source ? <p className="text-muted-foreground">{item.source}</p> : null}
            <p className="text-pretty text-foreground/85">{item.description}</p>
            <VideoMeta item={item} className="border-0 p-0" />
          </div>
          <div className="order-first overflow-hidden md:order-last">
            <VideoSource item={item} />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export function VideoCard({ item }: { item: Video }) {
  return (
    <Card className="py-0 transition-colors hover:ring-foreground/25">
      <CardContent className="grid gap-0 p-0 sm:grid-cols-[1fr_240px] md:grid-cols-[1fr_300px]">
        <div className="order-last flex flex-col justify-center gap-2 p-(--card-spacing) sm:order-first">
          <VideoKicker topic={item.topic} />
          <CardTitle className="text-base font-semibold text-balance">{item.title}</CardTitle>
          {item.source ? <p className="text-muted-foreground">{item.source}</p> : null}
          <p className="text-pretty text-foreground/85">{item.description}</p>
          <VideoMeta item={item} className="border-0 p-0" />
        </div>
        <div className="order-first w-full overflow-hidden sm:order-last sm:h-full sm:min-h-[135px] md:min-h-[170px] sm:[&>*]:aspect-auto sm:[&>*]:h-full sm:[&>*]:min-h-full sm:[&>*]:w-full sm:[&>video]:object-cover">
          <VideoSource item={item} />
        </div>
      </CardContent>
    </Card>
  );
}

export function VideoKicker({ topic, className }: { topic: string; className?: string }) {
  if (!topic) return null;
  return (
    <p className={cn("flex items-center gap-1.5 text-muted-foreground", className)}>
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
        <Badge variant="outline">{duration}</Badge>
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
        className="block aspect-video w-full border-0 bg-muted"
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
        className="block aspect-video w-full bg-muted"
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
      <span>Watch video</span>
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
        <div className="grid gap-5 md:grid-cols-2 md:items-center">
          <div className="order-last flex flex-col gap-2 md:order-first">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="order-first aspect-video h-auto w-full md:order-last" />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-px flex-1" />
        </div>
        <div className="flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="grid gap-4 sm:grid-cols-[1fr_240px] sm:items-center md:grid-cols-[1fr_300px]"
            >
              <div className="order-last flex flex-col gap-2 sm:order-first">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
              <Skeleton className="order-first aspect-video h-auto w-full sm:order-last" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
