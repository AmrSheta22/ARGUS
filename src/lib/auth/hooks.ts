import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";

import { authClient } from "./auth-client";
import { authQueryOptions } from "./queries";

/**
 * These hooks can be used in our components.
 * They share the same deduped query as beforeLoad/loaders in __root and the _auth layout,
 * so these will not result in unnecessary duplicate calls.
 *
 * For reading auth data in loaders/beforeLoad,
 * we can use `authQueryOptions` from queries.ts with `queryClient` from loader context.
 */

export function useAuth() {
  const { data: user, isPending } = useQuery(authQueryOptions());
  return { user, isPending };
}

export function useAuthSuspense() {
  const { data: user } = useSuspenseQuery(authQueryOptions());
  return { user };
}

export function useSignIn() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const result = await authClient.signIn.email({
        ...data,
      });

      if (result.error) {
        throw new Error(result.error.message || "An error occurred while signing in.");
      }

      return result.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authQueryOptions().queryKey });
      await router.invalidate();
    },
  });
}

export function useSignUp() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      password: string;
      callbackURL?: string;
    }) => {
      const result = await authClient.signUp.email({
        ...data,
      });

      if (result.error) {
        throw new Error(result.error.message || "An error occurred while signing up.");
      }

      return result.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authQueryOptions().queryKey });
      await router.invalidate();
    },
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await authClient.signOut({
        fetchOptions: {
          onResponse: async () => {
            // manually set to null to avoid unnecessary refetching
            queryClient.setQueryData(authQueryOptions().queryKey, null);
            await router.invalidate();
          },
        },
      });
      if (error) throw error;
      return data;
    },
  });
}
