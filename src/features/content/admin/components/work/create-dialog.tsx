import { LoaderCircleIcon } from "lucide-react";
import * as React from "react";
import { useEffect, useState } from "react";

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
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputList,
} from "#/components/ui/tags-input.tsx";
import { Textarea } from "#/components/ui/textarea.tsx";
import { toast } from "#/components/ui/toast.tsx";

import { workInputSchema, type Work, type WorkInput } from "../../../schemas.ts";
import { useCreateWork, useUpdateWork } from "../../hooks.ts";

type WorkFormValues = {
  code: string;
  year: string;
  title: string;
  area: string;
  status: string;
  authors: string[];
  abstract: string;
  url: string;
  sortOrder: string;
};

type FieldErrors = Partial<Record<keyof WorkInput, string>>;

function toFormValues(work: Work | null): WorkFormValues {
  return {
    code: work?.code ?? "",
    year: work?.year ? String(work.year) : String(new Date().getFullYear()),
    title: work?.title ?? "",
    area: work?.area ?? "",
    status: work?.status ?? "",
    authors: work?.authors ?? [],
    abstract: work?.abstract ?? "",
    url: work?.url ?? "",
    sortOrder: work?.sortOrder ? String(work.sortOrder) : "0",
  };
}

function parseValues(values: WorkFormValues) {
  const parsed = workInputSchema.safeParse({
    ...values,
    year: values.year === "" ? Number.NaN : Number(values.year),
    sortOrder: values.sortOrder === "" ? 0 : Number(values.sortOrder),
  });

  if (!parsed.success) {
    const errors: FieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof WorkInput;
      if (key && !errors[key]) {
        errors[key] = issue.message;
      }
    }
    return { errors };
  }

  return { data: parsed.data };
}

function WorkFormFields({
  errors,
  values,
  onChange,
  disabled,
}: {
  errors: FieldErrors;
  values: WorkFormValues;
  onChange: (updates: Partial<WorkFormValues>) => void;
  disabled?: boolean;
}) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="work-code">Code</FieldLabel>
          <Input
            id="work-code"
            placeholder="ARG-006"
            value={values.code}
            disabled={disabled}
            aria-invalid={!!errors.code}
            onChange={(e) => onChange({ code: e.target.value })}
          />
          {errors.code ? <FieldError>{errors.code}</FieldError> : null}
        </Field>
        <Field>
          <FieldLabel htmlFor="work-year">Year</FieldLabel>
          <Input
            id="work-year"
            type="number"
            min={1000}
            max={2100}
            value={values.year}
            disabled={disabled}
            aria-invalid={!!errors.year}
            onChange={(e) => onChange({ year: e.target.value })}
          />
          {errors.year ? <FieldError>{errors.year}</FieldError> : null}
        </Field>
      </div>
      <Field>
        <FieldLabel htmlFor="work-title">Title</FieldLabel>
        <Input
          id="work-title"
          placeholder="Robust Arabic misinformation detection under domain shift"
          value={values.title}
          disabled={disabled}
          aria-invalid={!!errors.title}
          onChange={(e) => onChange({ title: e.target.value })}
        />
        {errors.title ? <FieldError>{errors.title}</FieldError> : null}
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="work-area">Area</FieldLabel>
          <Input
            id="work-area"
            placeholder="Natural Language Processing"
            value={values.area}
            disabled={disabled}
            aria-invalid={!!errors.area}
            onChange={(e) => onChange({ area: e.target.value })}
          />
          {errors.area ? <FieldError>{errors.area}</FieldError> : null}
        </Field>
        <Field>
          <FieldLabel htmlFor="work-status">Status</FieldLabel>
          <Input
            id="work-status"
            placeholder="Under review"
            value={values.status}
            disabled={disabled}
            aria-invalid={!!errors.status}
            onChange={(e) => onChange({ status: e.target.value })}
          />
          {errors.status ? <FieldError>{errors.status}</FieldError> : null}
        </Field>
      </div>
      <Field>
        <FieldLabel>Authors</FieldLabel>
        <TagsInput
          value={values.authors}
          onValueChange={(authors) => onChange({ authors })}
          disabled={disabled}
          aria-invalid={!!errors.authors}
        >
          <TagsInputList>
            {values.authors.map((author) => (
              <TagsInputItem key={author} value={author}>
                {author}
              </TagsInputItem>
            ))}
            <TagsInputInput placeholder="Add author and press Enter" />
          </TagsInputList>
        </TagsInput>
        {errors.authors ? <FieldError>{errors.authors}</FieldError> : null}
      </Field>
      <Field>
        <FieldLabel htmlFor="work-abstract">Abstract</FieldLabel>
        <Textarea
          id="work-abstract"
          rows={4}
          placeholder="Summarize the research work..."
          value={values.abstract}
          disabled={disabled}
          aria-invalid={!!errors.abstract}
          onChange={(e) => onChange({ abstract: e.target.value })}
        />
        {errors.abstract ? <FieldError>{errors.abstract}</FieldError> : null}
      </Field>
      <Field>
        <FieldLabel htmlFor="work-url">URL</FieldLabel>
        <Input
          id="work-url"
          type="url"
          placeholder="https://arxiv.org/abs/..."
          value={values.url}
          disabled={disabled}
          aria-invalid={!!errors.url}
          onChange={(e) => onChange({ url: e.target.value })}
        />
        {errors.url ? <FieldError>{errors.url}</FieldError> : null}
      </Field>
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
  const isEditing = !!work;
  const createWork = useCreateWork();
  const updateWork = useUpdateWork();
  const isPending = isEditing ? updateWork.isPending : createWork.isPending;

  const [values, setValues] = useState<WorkFormValues>(() => toFormValues(work));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setValues(toFormValues(work));
      setErrors({});
      setSubmitError(null);
    }
  }, [open, work]);

  const handleChange = (updates: Partial<WorkFormValues>) => {
    setValues((prev) => ({ ...prev, ...updates }));
    setErrors((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(updates)) {
        delete next[key as keyof WorkInput];
      }
      return next;
    });
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const result = parseValues(values);
    if (!result.data) {
      setErrors(result.errors);
      return;
    }

    setSubmitError(null);
    try {
      if (isEditing && work) {
        await updateWork.mutateAsync({ id: work.id, data: result.data });
      } else {
        await createWork.mutateAsync(result.data);
      }
      toast.add({
        title: isEditing ? "Work updated" : "Work created",
        description: result.data.title,
        type: "success",
      });
      onOpenChange(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An error occurred. Please try again.";
      setSubmitError(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit work" : "New work"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of this research work."
              : "Add a new research work to the Our Work page."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          {submitError ? <FieldError>{submitError}</FieldError> : null}
          <WorkFormFields
            errors={errors}
            values={values}
            onChange={handleChange}
            disabled={isPending}
          />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <LoaderCircleIcon className="animate-spin" aria-hidden="true" />}
              {isEditing ? "Save changes" : "Create work"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
