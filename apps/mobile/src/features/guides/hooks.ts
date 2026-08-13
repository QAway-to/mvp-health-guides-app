import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useSession } from '@/features/auth/session';
import {
  fetchCategories,
  fetchGuide,
  fetchGuides,
  fetchHasPremium,
  fetchProgram,
  fetchProgress,
  saveProgress,
} from './api';
import type { ProgressRecord } from './types';

export const queryKeys = {
  categories: ['categories'] as const,
  guides: ['guides'] as const,
  guide: (slug: string) => ['guide', slug] as const,
  program: ['program'] as const,
  progress: ['progress'] as const,
  premium: ['premium'] as const,
};

export function useCategories() {
  return useQuery({ queryKey: queryKeys.categories, queryFn: fetchCategories });
}

export function useGuides() {
  return useQuery({ queryKey: queryKeys.guides, queryFn: fetchGuides });
}

export function useGuide(slug: string) {
  return useQuery({
    queryKey: queryKeys.guide(slug),
    queryFn: () => fetchGuide(slug),
    enabled: slug.length > 0,
  });
}

export function useProgram() {
  return useQuery({ queryKey: queryKeys.program, queryFn: fetchProgram });
}

export function useProgress() {
  const { userId } = useSession();
  return useQuery({
    queryKey: queryKeys.progress,
    queryFn: fetchProgress,
    enabled: userId !== null,
  });
}

export function useHasPremium() {
  const { userId } = useSession();
  return useQuery({
    queryKey: queryKeys.premium,
    queryFn: fetchHasPremium,
    enabled: userId !== null,
    // Подписка открывается вебхуком на сервере, а не ответом стора, поэтому
    // после покупки статус подтягивается с небольшой задержкой.
    staleTime: 30 * 1000,
  });
}

/**
 * Сохранение прогресса с оптимистичным обновлением: галочка на шаге не должна
 * ждать сети — гайды проходят на улице, где её может не быть вовсе.
 */
export function useSaveProgress() {
  const client = useQueryClient();
  const { userId } = useSession();

  return useMutation({
    mutationFn: async (input: { guideId: string; completedSteps: number[]; isCompleted: boolean }) => {
      if (!userId) {
        throw new Error('Нет сессии — прогресс сохранить некуда');
      }
      await saveProgress({ userId, ...input });
    },
    onMutate: async (input) => {
      await client.cancelQueries({ queryKey: queryKeys.progress });
      const previous = client.getQueryData<ProgressRecord[]>(queryKeys.progress) ?? [];

      const next: ProgressRecord = {
        guide_id: input.guideId,
        status: input.isCompleted ? 'completed' : 'in_progress',
        completed_steps: input.completedSteps,
        completed_at: input.isCompleted ? new Date().toISOString() : null,
      };

      client.setQueryData<ProgressRecord[]>(queryKeys.progress, [
        ...previous.filter((row) => row.guide_id !== input.guideId),
        next,
      ]);

      return { previous };
    },
    onError: (_error, _input, context) => {
      if (context?.previous) {
        client.setQueryData(queryKeys.progress, context.previous);
      }
    },
    onSettled: () => {
      client.invalidateQueries({ queryKey: queryKeys.progress });
    },
  });
}
