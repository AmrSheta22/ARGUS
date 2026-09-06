import type { AnyFormApi, FormApi } from "@tanstack/react-form";

type FormDataOf<TForm> =
  TForm extends FormApi<
    infer TData,
    infer _1,
    infer _2,
    infer _3,
    infer _4,
    infer _5,
    infer _6,
    infer _7,
    infer _8,
    infer _9,
    infer _10,
    infer _11
  >
    ? TData
    : never;

export function setFieldErrors<TForm extends AnyFormApi>(
  form: TForm,
  errors: Partial<Record<keyof FormDataOf<TForm> & string, string>>,
) {
  for (const [field, message] of Object.entries(errors)) {
    if (!message) continue;
    form.setFieldMeta(field, (prev) => ({
      ...prev,
      errorMap: {
        ...prev.errorMap,
        onSubmit: { message },
      },
    }));
  }
}

export function setFormErrors<TForm extends AnyFormApi>(form: TForm, message: string) {
  if (!message) return;
  form.setErrorMap({ onSubmit: { form: message, fields: {} } });
}
