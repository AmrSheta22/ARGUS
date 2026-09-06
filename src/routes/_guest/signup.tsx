import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LoaderCircleIcon } from "lucide-react";

import { SocialSignInButtons } from "#/components/sign-in-social-buttons.tsx";
import { Button } from "#/components/ui/button.tsx";
import { Field, FieldError, FieldGroup, FieldLabel } from "#/components/ui/field.tsx";
import { Input } from "#/components/ui/input.tsx";
import { PasswordInput } from "#/components/ui/password-input.tsx";
import { authClient } from "#/lib/auth/auth-client.ts";
import { authQueryOptions } from "#/lib/auth/queries.ts";
import { signUpSchema } from "#/lib/auth/schemas.ts";
import { getAuthErrorMessage } from "#/lib/auth/utils.ts";
import { setFieldErrors } from "#/lib/form.ts";

export const Route = createFileRoute("/_guest/signup")({
  component: SignupForm,
});

function SignupForm() {
  const { redirectUrl } = Route.useSearch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const signUp = useMutation({
    mutationFn: async (data: { name: string; email: string; password: string }) => {
      const result = await authClient.signUp.email({
        ...data,
        callbackURL: redirectUrl,
      });

      if (result.error) {
        throw new Error(result.error.message || "An error occurred while signing up.");
      }

      return result.data;
    },
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onChange: signUpSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await signUp.mutateAsync({
          name: value.name,
          email: value.email,
          password: value.password,
        });
        queryClient.removeQueries({ queryKey: authQueryOptions().queryKey });
        navigate({ to: redirectUrl });
      } catch (error) {
        setFieldErrors(form, { email: getAuthErrorMessage(error) });
      }
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
        <p className="text-sm text-muted-foreground">Start with a few basic details.</p>
      </div>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <FieldGroup>
          <form.Field name="name">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  placeholder="John Doe"
                  autoComplete="name"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
                />
                {field.state.meta.isTouched && !field.state.meta.isValid ? (
                  <FieldError errors={field.state.meta.errors} />
                ) : null}
              </Field>
            )}
          </form.Field>
          <form.Field name="email">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  placeholder="hello@example.com"
                  autoComplete="email"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
                />
                {field.state.meta.isTouched && !field.state.meta.isValid ? (
                  <FieldError errors={field.state.meta.errors} />
                ) : null}
              </Field>
            )}
          </form.Field>
          <form.Field name="password">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                <PasswordInput
                  id={field.name}
                  name={field.name}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
                />
                {field.state.meta.isTouched && !field.state.meta.isValid ? (
                  <FieldError errors={field.state.meta.errors} />
                ) : null}
              </Field>
            )}
          </form.Field>
          <form.Field name="confirmPassword">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
                <PasswordInput
                  id={field.name}
                  name={field.name}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
                />
                {field.state.meta.isTouched && !field.state.meta.isValid ? (
                  <FieldError errors={field.state.meta.errors} />
                ) : null}
              </Field>
            )}
          </form.Field>
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <>
                <Button type="submit" className="mt-2 w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting && <LoaderCircleIcon className="animate-spin" aria-hidden="true" />}
                  {isSubmitting ? "Signing up..." : "Sign up"}
                </Button>
                <SocialSignInButtons callbackURL={redirectUrl} disabled={isSubmitting} />
              </>
            )}
          </form.Subscribe>
        </FieldGroup>
      </form>

      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link to="/login" search={{ redirectUrl }} className="underline underline-offset-4">
          Log in
        </Link>
      </div>
    </div>
  );
}
