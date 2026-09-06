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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select.tsx";
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputList,
} from "#/components/ui/tags-input.tsx";
import { Textarea } from "#/components/ui/textarea.tsx";
import { toast } from "#/components/ui/toast.tsx";
import { WORK_CONTENT_STATUS_OPTIONS, type WorkStatus } from "#/consts/content.ts";

import { workInputSchema, type Work, type WorkInput } from "../../../schemas.ts";
import { useCreateWork, useUpdateWork } from "../../hooks.ts";

function fieldIsInvalid(field: AnyFieldApi) {
  return (
    !field.state.meta.isValid &&
    (field.state.meta.isTouched || (field.state.meta.errorMap.onSubmit?.length ?? 0) > 0)
  );
}

function WorkField({
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

function toFormValues(work: Work | null): WorkInput {
  return {
    title: work?.title ?? "",
    year: work?.year ?? new Date().getFullYear(),
    area: work?.area ?? "",
    status: work?.status ?? "under-review",
    authors: work?.authors ?? [],
    abstract: work?.abstract ?? "",
    url: work?.url ?? "",
  };
}

function WorkFormDialog({ work, onClose }: { work: Work | null; onClose: () => void }) {
  const isEditing = !!work;
  const createWork = useCreateWork();
  const updateWork = useUpdateWork();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: toFormValues(work),
    validators: {
      onChange: workInputSchema,
      onSubmit: workInputSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null);
      try {
        if (work) {
          await updateWork.mutateAsync({ id: work.id, data: value });
        } else {
          await createWork.mutateAsync(value);
        }
        toast.add({
          title: work ? "Work updated" : "Work created",
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
        <DialogTitle>{isEditing ? "Edit work" : "New work"}</DialogTitle>
        <DialogDescription>
          {isEditing
            ? "Update the details of this research work."
            : "Add a new research work to the Our Work page."}
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
                    <WorkField field={field} label="Title" htmlFor={field.name}>
                      {(isInvalid) => (
                        <Input
                          id={field.name}
                          name={field.name}
                          placeholder="Robust Arabic misinformation detection under domain shift"
                          value={field.state.value}
                          disabled={isSubmitting}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                        />
                      )}
                    </WorkField>
                  )}
                </form.Field>
                <form.Field name="year">
                  {(field) => (
                    <WorkField field={field} label="Year" htmlFor={field.name}>
                      {(isInvalid) => (
                        <Input
                          id={field.name}
                          name={field.name}
                          type="number"
                          min={1000}
                          max={2100}
                          inputMode="numeric"
                          value={Number.isNaN(field.state.value) ? "" : field.state.value}
                          disabled={isSubmitting}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                          aria-invalid={isInvalid}
                        />
                      )}
                    </WorkField>
                  )}
                </form.Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <form.Field name="area">
                  {(field) => (
                    <WorkField field={field} label="Area" htmlFor={field.name}>
                      {(isInvalid) => (
                        <Input
                          id={field.name}
                          name={field.name}
                          placeholder="Natural Language Processing"
                          value={field.state.value}
                          disabled={isSubmitting}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                        />
                      )}
                    </WorkField>
                  )}
                </form.Field>
                <form.Field name="status">
                  {(field) => (
                    <WorkField field={field} label="Status">
                      {(isInvalid) => (
                        <Select
                          name={field.name}
                          value={field.state.value}
                          onValueChange={(value) =>
                            field.handleChange((value ?? "under-review") as WorkStatus)
                          }
                          items={WORK_CONTENT_STATUS_OPTIONS}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger className="w-full" aria-invalid={isInvalid}>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {WORK_CONTENT_STATUS_OPTIONS.map(({ value, label }) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </WorkField>
                  )}
                </form.Field>
              </div>
              <form.Field name="authors">
                {(field) => (
                  <WorkField field={field} label="Authors">
                    {(isInvalid) => (
                      <TagsInput
                        value={field.state.value}
                        onValueChange={(value) => field.handleChange(value)}
                        disabled={isSubmitting}
                        aria-invalid={isInvalid}
                      >
                        <TagsInputList>
                          {field.state.value.map((author) => (
                            <TagsInputItem key={author} value={author}>
                              {author}
                            </TagsInputItem>
                          ))}
                          <TagsInputInput placeholder="Add author and press Enter" />
                        </TagsInputList>
                      </TagsInput>
                    )}
                  </WorkField>
                )}
              </form.Field>
              <form.Field name="abstract">
                {(field) => (
                  <WorkField field={field} label="Abstract" htmlFor={field.name}>
                    {(isInvalid) => (
                      <Textarea
                        id={field.name}
                        name={field.name}
                        rows={4}
                        placeholder="Summarize the research work..."
                        value={field.state.value}
                        disabled={isSubmitting}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                      />
                    )}
                  </WorkField>
                )}
              </form.Field>
              <form.Field name="url">
                {(field) => (
                  <WorkField field={field} label="URL" htmlFor={field.name}>
                    {(isInvalid) => (
                      <Input
                        id={field.name}
                        name={field.name}
                        type="url"
                        placeholder="https://arxiv.org/abs/..."
                        value={field.state.value}
                        disabled={isSubmitting}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                      />
                    )}
                  </WorkField>
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
                      : "Create work"}
                </Button>
              </DialogFooter>
            </>
          )}
        </form.Subscribe>
      </form>
    </>
  );
}

export function WorkDialog({
  work,
  open,
  onOpenChange,
}: {
  work: Work | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {open ? <WorkFormDialog work={work} onClose={() => onOpenChange(false)} /> : null}
      </DialogContent>
    </Dialog>
  );
}
