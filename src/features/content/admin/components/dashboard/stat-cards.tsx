import { Link } from "@tanstack/react-router";
import {
  BookOpenIcon,
  BriefcaseIcon,
  FileTextIcon,
  VideoIcon,
  type LucideIcon,
} from "lucide-react";
import * as React from "react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card.tsx";
import { formatDuration } from "#/consts/content.ts";

import type { Knowledge, Summary, Video, Work } from "../../../schemas.ts";

type StatCardProps = {
  to: "/admin/work" | "/admin/videos" | "/admin/summaries" | "/admin/knowledge";
  label: string;
  icon: LucideIcon;
  total: number;
  description?: string;
};

function StatCard({ to, label, icon: Icon, total, description }: StatCardProps) {
  return (
    <Link
      to={to}
      className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <Card className="gap-(--card-spacing) transition-colors hover:ring-foreground/20">
        <CardHeader>
          <CardTitle className="text-muted-foreground">{label}</CardTitle>
          <CardAction>
            <Icon aria-hidden="true" className="size-4 text-muted-foreground" />
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-1">
          <p className="text-3xl font-semibold tracking-tight tabular-nums">{total}</p>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </CardContent>
      </Card>
    </Link>
  );
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
});

function lastUpdatedAt(items: Array<{ updatedAt: string }>): string | undefined {
  if (items.length === 0) return undefined;
  const latest = items.reduce((latest, item) =>
    item.updatedAt > latest.updatedAt ? item : latest,
  );
  return dateFormatter.format(new Date(latest.updatedAt));
}

type StatCardsProps = {
  work: Work[];
  videos: Video[];
  summaries: Summary[];
  knowledge: Knowledge[];
};

export function StatCards({ work, videos, summaries, knowledge }: StatCardsProps) {
  const published = work.filter((item) => item.status === "published").length;
  const underReview = work.length - published;
  const totalMinutes = videos.reduce((sum, video) => sum + video.durationMinutes, 0);
  const videoTime = formatDuration(totalMinutes);

  const summaryUpdated = lastUpdatedAt(summaries);
  const knowledgeUpdated = lastUpdatedAt(knowledge);

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        to="/admin/work"
        label="Work"
        icon={BriefcaseIcon}
        total={work.length}
        description={`${published} published · ${underReview} under review`}
      />
      <StatCard
        to="/admin/videos"
        label="Videos"
        icon={VideoIcon}
        total={videos.length}
        description={videoTime ? `${videoTime} of video` : undefined}
      />
      <StatCard
        to="/admin/summaries"
        label="Summaries"
        icon={FileTextIcon}
        total={summaries.length}
        description={summaryUpdated ? `Last updated ${summaryUpdated}` : undefined}
      />
      <StatCard
        to="/admin/knowledge"
        label="Knowledge"
        icon={BookOpenIcon}
        total={knowledge.length}
        description={knowledgeUpdated ? `Last updated ${knowledgeUpdated}` : undefined}
      />
    </div>
  );
}
