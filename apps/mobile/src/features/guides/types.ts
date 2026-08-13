export type Tier = 'free' | 'premium';
export type Level = 'beginner' | 'regular';

export type Category = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  order_index: number;
};

export type GuideStep = {
  id: string;
  order_index: number;
  title: string;
  body: string;
  duration_sec: number | null;
  checklist: string[];
};

export type Guide = {
  id: string;
  slug: string;
  category_id: string;
  title: string;
  summary: string;
  tier: Tier;
  level: Level;
  duration_min: number;
  tags: string[];
  contraindications: string | null;
  order_index: number;
};

export type GuideWithSteps = Guide & { steps: GuideStep[] };

export type ProgressRecord = {
  guide_id: string;
  status: 'in_progress' | 'completed';
  completed_steps: number[];
  completed_at: string | null;
};

export type ProgramDay = {
  week: number;
  day: number;
  guide_id: string;
  note: string | null;
};
