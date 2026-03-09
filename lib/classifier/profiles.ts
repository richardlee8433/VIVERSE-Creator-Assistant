import type { CreatorProfileId } from '@/lib/session/types';

export const PROFILE_LABELS: Record<CreatorProfileId, string> = {
  beginner_creator: 'Beginner Creator',
  three_d_creator: '3D Creator',
  interactive_builder: 'Interactive Builder',
  web_engine_developer: 'Web/Engine Developer',
};

export const PROFILE_ORDER_SIMPLER_TO_COMPLEX: CreatorProfileId[] = [
  'beginner_creator',
  'three_d_creator',
  'interactive_builder',
  'web_engine_developer',
];
