import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Work, WorkInput } from "../schemas.ts";
import { $createWork, $deleteWork, $updateWork } from "./actions.ts";
import { adminWorkQueryKeys } from "./queries.ts";

export function useCreateWork() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: WorkInput) => $createWork({ data: input }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminWorkQueryKeys.all });
    },
  });
}

export function useUpdateWork() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: WorkInput }) =>
      $updateWork({ data: { id, data } }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminWorkQueryKeys.all });
    },
  });
}

export function useDeleteWork() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (work: Work) => $deleteWork({ data: { id: work.id } }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminWorkQueryKeys.all });
    },
  });
}
