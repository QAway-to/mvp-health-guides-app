import { useMemo } from 'react';

import { useGuides, useProgram, useProgress } from '@/features/guides/hooks';
import type { Guide, ProgramDay } from '@/features/guides/types';

export type TodayState = {
  isPending: boolean;
  isError: boolean;
  /** Практика на сегодня. null, когда программа пройдена целиком. */
  today: { day: ProgramDay; guide: Guide } | null;
  /** Сколько дней недели уже закрыто и сколько всего. */
  week: { number: number; done: number; total: number };
  completedTotal: number;
  programLength: number;
};

/**
 * Что делать сегодня.
 *
 * День определяется не календарём, а прогрессом: пропущенная пробежка не
 * должна «сгорать» — иначе человек, выпавший на три дня, возвращается к
 * четвёртому дню и бросает. Сегодня — это первый непройденный день.
 */
export function useToday(): TodayState {
  const program = useProgram();
  const guides = useGuides();
  const progress = useProgress();

  return useMemo(() => {
    const isPending = program.isPending || guides.isPending;
    const isError = program.isError || guides.isError;

    const days = program.data ?? [];
    const byId = new Map((guides.data ?? []).map((guide) => [guide.id, guide]));
    const completed = new Set(
      (progress.data ?? []).filter((row) => row.status === 'completed').map((row) => row.guide_id),
    );

    const nextDay = days.find((day) => !completed.has(day.guide_id)) ?? null;
    const guide = nextDay ? byId.get(nextDay.guide_id) : undefined;

    const weekNumber = nextDay?.week ?? (days.at(-1)?.week ?? 1);
    const weekDays = days.filter((day) => day.week === weekNumber);

    return {
      isPending,
      isError,
      today: nextDay && guide ? { day: nextDay, guide } : null,
      week: {
        number: weekNumber,
        done: weekDays.filter((day) => completed.has(day.guide_id)).length,
        total: weekDays.length,
      },
      completedTotal: days.filter((day) => completed.has(day.guide_id)).length,
      programLength: days.length,
    };
  }, [
    program.data,
    program.isPending,
    program.isError,
    guides.data,
    guides.isPending,
    guides.isError,
    progress.data,
  ]);
}
