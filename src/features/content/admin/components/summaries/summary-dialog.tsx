import { useForm, type AnyFieldApi } from "@tanstack/react-form";
import { LoaderCircleIcon } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "#/components/ui/button.tsx";
import { Field, FieldError, FieldLabel } from "#/components/ui/field.tsx";
import { Input } from "#/components/ui/input.tsx";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "#/components/ui/responsive-dialog.tsx";
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputList,
} from "#/components/ui/tags-input.tsx";
import { Textarea } from "#/components/ui/textarea.tsx";
import { toast } from "#/components/ui/toast.tsx";

import { summaryInputSchema, type Summary, type SummaryInput } from "../../../schemas.ts";
import { splitTags } from "../../../utils.ts";
import { useCreateSummary, useUpdateSummary } from "../../hooks.ts";

function fieldIsInvalid(field: AnyFieldApi) {
  return (
    !field.state.meta.isValid &&
    (field.state.meta.isTouched || (field.state.meta.errorMap.onSubmit?.length ?? 0) > 0)
  );
}

function SummaryField({
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

function toFormValues(summary: Summary | null): SummaryInput {
  return {
    title: summary?.title ?? "",
    subtitle: summary?.subtitle ?? "",
    description: summary?.description ?? "",
    url: summary?.url ?? "",
    tags: summary ? splitTags(summary.tags) : [],
  };
}

function SummaryFormDialog({ summary, onClose }: { summary: Summary | null; onClose: () => void }) {
  const isEditing = !!summary;
  const createSummary = useCreateSummary();
  const updateSummary = useUpdateSummary();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: toFormValues(summary),
    validators: {
      onChange: summaryInputSchema,
      onSubmit: summaryInputSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null);
      try {
        if (summary) {
          await updateSummary.mutateAsync({ id: summary.id, data: value });
        } else {
          await createSummary.mutateAsync(value);
        }
        toast.add({
          title: summary ? "Summary updated" : "Summary created",
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
      <ResponsiveDialogHeader>
        <ResponsiveDialogTitle>{isEditing ? "Edit summary" : "New summary"}</ResponsiveDialogTitle>
        <ResponsiveDialogDescription>
          {isEditing
            ? "Update the details of this paper summary."
            : "Add a new paper summary to the Summaries page."}
        </ResponsiveDialogDescription>
      </ResponsiveDialogHeader>
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
                    <SummaryField field={field} label="Title" htmlFor={field.name}>
                      {(isInvalid) => (
                        <Input
                          id={field.name}
                          name={field.name}
                          placeholder="Attention Is All You Need"
                          value={field.state.value}
                          disabled={isSubmitting}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                        />
                      )}
                    </SummaryField>
                  )}
                </form.Field>
                <form.Field name="subtitle">
                  {(field) => (
                    <SummaryField field={field} label="Subtitle" htmlFor={field.name}>
                      {(isInvalid) => (
                        <Input
                          id={field.name}
                          name={field.name}
                          placeholder="Vaswani et al. · NeurIPS 2017"
                          value={field.state.value}
                          disabled={isSubmitting}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                        />
                      )}
                    </SummaryField>
                  )}
                </form.Field>
              </div>
              <form.Field name="tags">
                {(field) => (
                  <SummaryField field={field} label="Tags">
                    {(isInvalid) => (
                      <TagsInput
                        value={field.state.value}
                        onValueChange={(value) => field.handleChange(value)}
                        disabled={isSubmitting}
                        aria-invalid={isInvalid}
                      >
                        <TagsInputList>
                          {field.state.value.map((tag) => (
                            <TagsInputItem key={tag} value={tag}>
                              {tag}
                            </TagsInputItem>
                          ))}
                          <TagsInputInput placeholder="Add tag and press Enter" />
                        </TagsInputList>
                      </TagsInput>
                    )}
                  </SummaryField>
                )}
              </form.Field>
              <form.Field name="url">
                {(field) => (
                  <SummaryField field={field} label="URL" htmlFor={field.name}>
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
                  </SummaryField>
                )}
              </form.Field>
              <form.Field name="description">
                {(field) => (
                  <SummaryField field={field} label="Description" htmlFor={field.name}>
                    {(isInvalid) => (
                      <Textarea
                        id={field.name}
                        name={field.name}
                        rows={4}
                        placeholder="Summarize the paper..."
                        value={field.state.value}
                        disabled={isSubmitting}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                      />
                    )}
                  </SummaryField>
                )}
              </form.Field>
              <ResponsiveDialogFooter>
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
                      : "Create summary"}
                </Button>
              </ResponsiveDialogFooter>
            </>
          )}
        </form.Subscribe>
      </form>
    </>
  );
}

export function SummaryDialog({
  summary,
  open,
  onOpenChange,
}: {
  summary: Summary | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="data-[variant=dialog]:max-w-lg">
        {open ? <SummaryFormDialog summary={summary} onClose={() => onOpenChange(false)} /> : null}
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
