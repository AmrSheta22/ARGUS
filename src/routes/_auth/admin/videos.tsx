import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "#/components/ui/button.tsx";
import { Skeleton } from "#/components/ui/skeleton.tsx";
import { VideoTable } from "#/features/content/admin/components/videos/table.tsx";
import { VideoDialog } from "#/features/content/admin/components/videos/video-dialog.tsx";
import { videoQueryOptions } from "#/features/content/queries.ts";
import type { Video } from "#/features/content/schemas.ts";

export const Route = createFileRoute("/_auth/admin/videos")({
  component: VideosRoute,
});

function VideosRoute() {
  const { data, isPending, isError, refetch } = useQuery(videoQueryOptions());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);

  const openCreate = () => {
    setEditingVideo(null);
    setDialogOpen(true);
  };

  const openEdit = (video: Video) => {
    setEditingVideo(video);
    setDialogOpen(true);
  };

  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Videos</h1>
          <p className="text-sm text-muted-foreground">Manage curated video resources.</p>
        </div>
        <Button onClick={openCreate}>
          <PlusIcon />
          New video
        </Button>
      </div>

      {isPending ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
      ) : isError || !data ? (
        <div className="flex flex-col items-center gap-2 rounded-none border border-dashed p-8 text-center">
          <p className="text-sm text-muted-foreground">Failed to load videos.</p>
          <Button variant="outline" size="sm" onClick={() => void refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <VideoTable data={data} onEdit={openEdit} />
      )}

      <VideoDialog video={editingVideo} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
