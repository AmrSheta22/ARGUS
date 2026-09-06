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
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputList,
} from "#/components/ui/tags-input.tsx";
import { Textarea } from "#/components/ui/textarea.tsx";
import { toast } from "#/components/ui/toast.tsx";

import { knowledgeInputSchema, type Knowledge, type KnowledgeInput } from "../../../schemas.ts";
import { splitTags } from "../../../utils.ts";
import { useCreateKnowledge, useUpdateKnowledge } from "../../hooks.ts";

function fieldIsInvalid(field: AnyFieldApi) {
  return (
    !field.state.meta.isValid &&
    (field.state.meta.isTouched || (field.state.meta.errorMap.onSubmit?.length ?? 0) > 0)
  );
}

function KnowledgeField({
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

function toFormValues(knowledge: Knowledge | null): KnowledgeInput {
  return {
    title: knowledge?.title ?? "",
    subtitle: knowledge?.subtitle ?? "",
    description: knowledge?.description ?? "",
    url: knowledge?.url ?? "",
    tags: knowledge ? splitTags(knowledge.tags) : [],
  };
}

function KnowledgeFormDialog({
  knowledge,
  onClose,
}: {
  knowledge: Knowledge | null;
  onClose: () => void;
}) {
  const isEditing = !!knowledge;
  const createKnowledge = useCreateKnowledge();
  const updateKnowledge = useUpdateKnowledge();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: toFormValues(knowledge),
    validators: {
      onChange: knowledgeInputSchema,
      onSubmit: knowledgeInputSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null);
      try {
        if (knowledge) {
          await updateKnowledge.mutateAsync({ id: knowledge.id, data: value });
        } else {
          await createKnowledge.mutateAsync(value);
        }
        toast.add({
          title: knowledge ? "Knowledge path updated" : "Knowledge path created",
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
        <DialogTitle>{isEditing ? "Edit knowledge path" : "New knowledge path"}</DialogTitle>
        <DialogDescription>
          {isEditing
            ? "Update the details of this knowledge path."
            : "Add a new knowledge path to the Foundational knowledge page."}
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
                    <KnowledgeField field={field} label="Title" htmlFor={field.name}>
                      {(isInvalid) => (
                        <Input
                          id={field.name}
                          name={field.name}
                          placeholder="Machine Learning Foundations"
                          value={field.state.value}
                          disabled={isSubmitting}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                        />
                      )}
                    </KnowledgeField>
                  )}
                </form.Field>
                <form.Field name="subtitle">
                  {(field) => (
                    <KnowledgeField field={field} label="Subtitle" htmlFor={field.name}>
                      {(isInvalid) => (
                        <Input
                          id={field.name}
                          name={field.name}
                          placeholder="A guided learning path"
                          value={field.state.value}
                          disabled={isSubmitting}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                        />
                      )}
                    </KnowledgeField>
                  )}
                </form.Field>
              </div>
              <form.Field name="tags">
                {(field) => (
                  <KnowledgeField field={field} label="Tags">
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
                  </KnowledgeField>
                )}
              </form.Field>
              <form.Field name="url">
                {(field) => (
                  <KnowledgeField field={field} label="URL" htmlFor={field.name}>
                    {(isInvalid) => (
                      <Input
                        id={field.name}
                        name={field.name}
                        type="url"
                        placeholder="https://developers.google.com/machine-learning/crash-course"
                        value={field.state.value}
                        disabled={isSubmitting}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                      />
                    )}
                  </KnowledgeField>
                )}
              </form.Field>
              <form.Field name="description">
                {(field) => (
                  <KnowledgeField field={field} label="Description" htmlFor={field.name}>
                    {(isInvalid) => (
                      <Textarea
                        id={field.name}
                        name={field.name}
                        rows={4}
                        placeholder="What will this learning path cover?"
                        value={field.state.value}
                        disabled={isSubmitting}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                      />
                    )}
                  </KnowledgeField>
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
                      : "Create knowledge path"}
                </Button>
              </DialogFooter>
            </>
          )}
        </form.Subscribe>
      </form>
    </>
  );
}

export function KnowledgeDialog({
  knowledge,
  open,
  onOpenChange,
}: {
  knowledge: Knowledge | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {open ? (
          <KnowledgeFormDialog knowledge={knowledge} onClose={() => onOpenChange(false)} />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
