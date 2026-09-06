import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LoaderCircleIcon } from "lucide-react";

import { SocialSignInButtons } from "#/components/sign-in-social-buttons.tsx";
import { Button } from "#/components/ui/button.tsx";
import { Field, FieldError, FieldGroup, FieldLabel } from "#/components/ui/field.tsx";
import { Input } from "#/components/ui/input.tsx";
import { PasswordInput } from "#/components/ui/password-input.tsx";
import { env } from "#/env/client.ts";
import { authClient } from "#/lib/auth/auth-client.ts";
import { authQueryOptions } from "#/lib/auth/queries.ts";
import { loginSchema } from "#/lib/auth/schemas.ts";
import { getAuthErrorMessage } from "#/lib/auth/utils.ts";
import { setFormErrors } from "#/lib/form.ts";

export const Route = createFileRoute("/_guest/login")({
  component: LoginForm,
});

function LoginForm() {
  const { redirectUrl } = Route.useSearch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const emailLogin = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const result = await authClient.signIn.email({
        ...data,
      });

      if (result.error) {
        throw new Error(result.error.message || "An error occurred while signing in.");
      }

      return result.data;
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await emailLogin.mutateAsync({
          email: value.email,
          password: value.password,
        });
        queryClient.removeQueries({ queryKey: authQueryOptions().queryKey });
        navigate({ to: redirectUrl });
      } catch (error) {
        setFormErrors(form, getAuthErrorMessage(error));
      }
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Enter your details to access your account.</p>
      </div>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <div className="flex flex-col gap-6">
          <DeleteMeDemoAccount />
          <FieldGroup>
            <form.Subscribe selector={(state) => state.errorMap.onSubmit as string | undefined}>
              {(onSubmitError) => (onSubmitError ? <FieldError>{onSubmitError}</FieldError> : null)}
            </form.Subscribe>
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
                    placeholder="Enter your password"
                    autoComplete="current-password"
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
                    {isSubmitting && (
                      <LoaderCircleIcon className="animate-spin" aria-hidden="true" />
                    )}
                    {isSubmitting ? "Logging in..." : "Log in"}
                  </Button>
                  <SocialSignInButtons callbackURL={redirectUrl} disabled={isSubmitting} />
                </>
              )}
            </form.Subscribe>
          </FieldGroup>
        </div>
      </form>

      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link to="/signup" search={{ redirectUrl }} className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </div>
  );
}

/**
 * TODO: Delete this.
 * Demo credentials for the live deployment of the TanStarter template on which this project is based.
 */
function DeleteMeDemoAccount() {
  if (new URL(env.VITE_BASE_URL).origin !== "https://tanstarter.mugnavo.com") return null;

  return (
    <div className="rounded-md border border-dashed bg-muted/50 p-3 text-sm">
      <p className="text-xs text-muted-foreground">Demo account credentials</p>
      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
        <dt className="text-muted-foreground">Email</dt>
        <dd>
          <code className="select-all">demo@mugnavo.com</code>
        </dd>
        <dt className="text-muted-foreground">Password</dt>
        <dd>
          <code className="select-all">demo1234</code>
        </dd>
      </dl>
    </div>
  );
}
