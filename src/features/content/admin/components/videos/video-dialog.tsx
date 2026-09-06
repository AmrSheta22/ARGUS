import { useForm, type AnyFieldApi } from "@tanstack/react-form";
import { LoaderCircleIcon } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "#/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "#/components/ui/dialog.tsx";
import { Field, FieldError, FieldLabel } from "#/components/ui/field.tsx";
import { Input } from "#/components/ui/input.tsx";
import { Textarea } from "#/components/ui/textarea.tsx";
import { toast } from "#/components/ui/toast.tsx";

import { videoInputSchema, type Video, type VideoInput } from "../../../schemas.ts";
import { useCreateVideo, useUpdateVideo } from "../../hooks.ts";

function fieldIsInvalid(field: AnyFieldApi) {
  return (
    !field.state.meta.isValid &&
    (field.state.meta.isTouched || (field.state.meta.errorMap.onSubmit?.length ?? 0) > 0)
  );
}

function VideoField({
  field,
  label,
  htmlFor,
  children,
}: {
  field: AnyFieldApi;
  label: string;
  htmlFor?: string;
  children: (isInvalid: boolean) => ReactNode;
}) {
  const isInvalid = fieldIsInvalid(field);

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
      {children(isInvalid)}
      {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
    </Field>
  );
}

function toFormValues(video: Video | null): VideoInput {
  return {
    title: video?.title ?? "",
    source: video?.source ?? "",
    topic: video?.topic ?? "",
    durationMinutes: video?.durationMinutes ?? 0,
    url: video?.url ?? "",
    description: video?.description ?? "",
  };
}

function VideoFormDialog({ video, onClose }: { video: Video | null; onClose: () => void }) {
  const isEditing = !!video;
  const createVideo = useCreateVideo();
  const updateVideo = useUpdateVideo();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: toFormValues(video),
    validators: {
      onChange: videoInputSchema,
      onSubmit: videoInputSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null);
      try {
        if (video) {
          await updateVideo.mutateAsync({ id: video.id, data: value });
        } else {
          await createVideo.mutateAsync(value);
        }
        toast.add({
          title: video ? "Video updated" : "Video created",
          description: value.title,
          type: "success",
        });
        onClose();
      } catch (error) {
        setSubmitError(
          error instanceof Error ? error.message : "An error occurred. Please try again.",
        );
      }
    },
  });

  return (
    <>
      <DialogHeader>
        <DialogTitle>{isEditing ? "Edit video" : "New video"}</DialogTitle>
        <DialogDescription>
          {isEditing
            ? "Update the details of this video."
            : "Add a new curated video to the Videos page."}
        </DialogDescription>
      </DialogHeader>
      <form
        noValidate
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        {submitError ? <FieldError>{submitError}</FieldError> : null}
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <>
              <div className="grid grid-cols-2 gap-4">
                <form.Field name="title">
                  {(field) => (
                    <VideoField field={field} label="Title" htmlFor={field.name}>
                      {(isInvalid) => (
                        <Input
                          id={field.name}
                          name={field.name}
                          placeholder="But what is a neural network?"
                          value={field.state.value}
                          disabled={isSubmitting}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                        />
                      )}
                    </VideoField>
                  )}
                </form.Field>
                <form.Field name="durationMinutes">
                  {(field) => (
                    <VideoField field={field} label="Duration (minutes)" htmlFor={field.name}>
                      {(isInvalid) => (
                        <Input
                          id={field.name}
                          name={field.name}
                          type="number"
                          min={0}
                          step={1}
                          inputMode="numeric"
                          value={Number.isNaN(field.state.value) ? "" : field.state.value}
                          disabled={isSubmitting}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                          aria-invalid={isInvalid}
                        />
                      )}
                    </VideoField>
                  )}
                </form.Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <form.Field name="source">
                  {(field) => (
                    <VideoField field={field} label="Source" htmlFor={field.name}>
                      {(isInvalid) => (
                        <Input
                          id={field.name}
                          name={field.name}
                          placeholder="3Blue1Brown"
                          value={field.state.value}
                          disabled={isSubmitting}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                        />
                      )}
                    </VideoField>
                  )}
                </form.Field>
                <form.Field name="topic">
                  {(field) => (
                    <VideoField field={field} label="Topic" htmlFor={field.name}>
                      {(isInvalid) => (
                        <Input
                          id={field.name}
                          name={field.name}
                          placeholder="Deep Learning"
                          value={field.state.value}
                          disabled={isSubmitting}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                        />
                      )}
                    </VideoField>
                  )}
                </form.Field>
              </div>
              <form.Field name="url">
                {(field) => (
                  <VideoField field={field} label="Video URL" htmlFor={field.name}>
                    {(isInvalid) => (
                      <Input
                        id={field.name}
                        name={field.name}
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={field.state.value}
                        disabled={isSubmitting}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                      />
                    )}
                  </VideoField>
                )}
              </form.Field>
              <form.Field name="description">
                {(field) => (
                  <VideoField field={field} label="Description" htmlFor={field.name}>
                    {(isInvalid) => (
                      <Textarea
                        id={field.name}
                        name={field.name}
                        rows={4}
                        placeholder="What is this video about?"
                        value={field.state.value}
                        disabled={isSubmitting}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                      />
                    )}
                  </VideoField>
                )}
              </form.Field>
              <DialogFooter>
                <Button type="button" variant="outline" disabled={isSubmitting} onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <LoaderCircleIcon className="animate-spin" aria-hidden="true" />}
                  {isSubmitting
                    ? isEditing
                      ? "Saving..."
                      : "Creating..."
                    : isEditing
                      ? "Save changes"
                      : "Create video"}
                </Button>
              </DialogFooter>
            </>
          )}
        </form.Subscribe>
      </form>
    </>
  );
}

export function VideoDialog({
  video,
  open,
  onOpenChange,
}: {
  video: Video | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {open ? <VideoFormDialog video={video} onClose={() => onOpenChange(false)} /> : null}
      </DialogContent>
    </Dialog>
  );
}
