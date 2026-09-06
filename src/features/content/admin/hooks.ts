import { useMutation, useQueryClient } from "@tanstack/react-query";

import { knowledgeQueryKeys, summaryQueryKeys, videoQueryKeys, workQueryKeys } from "../queries.ts";
import type {
  Knowledge,
  KnowledgeInput,
  Summary,
  SummaryInput,
  Video,
  VideoInput,
  Work,
  WorkInput,
} from "../schemas.ts";
import {
  $createKnowledge,
  $deleteKnowledge,
  $updateKnowledge,
  $createSummary,
  $deleteSummary,
  $updateSummary,
  $createVideo,
  $deleteVideo,
  $updateVideo,
  $createWork,
  $deleteWork,
  $updateWork,
} from "./actions.ts";

export function useCreateWork() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: WorkInput) => $createWork({ data: input }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: workQueryKeys.all });
    },
  });
}

export function useUpdateWork() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: WorkInput }) =>
      $updateWork({ data: { id, data } }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: workQueryKeys.all });
    },
  });
}

export function useDeleteWork() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (work: Work) => $deleteWork({ data: { id: work.id } }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: workQueryKeys.all });
    },
  });
}

export function useCreateVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: VideoInput) => $createVideo({ data: input }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: videoQueryKeys.all });
    },
  });
}

export function useUpdateVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: VideoInput }) =>
      $updateVideo({ data: { id, data } }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: videoQueryKeys.all });
    },
  });
}

export function useDeleteVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (video: Video) => $deleteVideo({ data: { id: video.id } }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: videoQueryKeys.all });
    },
  });
}

export function useCreateSummary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: SummaryInput) => $createSummary({ data: input }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: summaryQueryKeys.all });
    },
  });
}

export function useUpdateSummary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: SummaryInput }) =>
      $updateSummary({ data: { id, data } }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: summaryQueryKeys.all });
    },
  });
}

export function useDeleteSummary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (summary: Summary) => $deleteSummary({ data: { id: summary.id } }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: summaryQueryKeys.all });
    },
  });
}

export function useCreateKnowledge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: KnowledgeInput) => $createKnowledge({ data: input }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: knowledgeQueryKeys.all });
    },
  });
}

export function useUpdateKnowledge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: KnowledgeInput }) =>
      $updateKnowledge({ data: { id, data } }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: knowledgeQueryKeys.all });
    },
  });
}

export function useDeleteKnowledge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (knowledge: Knowledge) => $deleteKnowledge({ data: { id: knowledge.id } }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: knowledgeQueryKeys.all });
    },
  });
}
