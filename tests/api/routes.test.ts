import { beforeEach, describe, expect, it } from 'vitest';
import { rm } from 'node:fs/promises';
import { submitOnboarding, getRecommendation, askOnboardingQuestion } from '@/lib/api';

const storePath = './data/test-sessions.json';

beforeEach(async () => {
  process.env.SESSION_STORE_PATH = storePath;
  await rm(storePath, { force: true });
});

describe('api flows', () => {
  it('onboarding submit success', async () => {
    const result = await submitOnboarding({
      answers: {
        goal: 'interactive_experience',
        experience: 'playcanvas',
        workflow: 'writing_code',
        assets: '3d_models',
        first_project_goal: 'interactive_world',
        biggest_concern: 'tools_setup',
      },
    });

    expect(result.status).toBe(200);
    expect(result.body.sessionId).toBeTruthy();
  });

  it('onboarding submit invalid payload', async () => {
    const result = await submitOnboarding({ answers: { invalid: true } });
    expect(result.status).toBe(400);
  });

  it('recommendation session not found', async () => {
    const result = await getRecommendation('missing');
    expect(result.status).toBe(404);
  });

  it('ask route out-of-scope question', async () => {
    const submit = await submitOnboarding({
      answers: {
        goal: 'interactive_experience',
        experience: 'playcanvas',
        workflow: 'writing_code',
        assets: '3d_models',
        first_project_goal: 'interactive_world',
        biggest_concern: 'tools_setup',
      },
    });

    const ask = await askOnboardingQuestion({
      sessionId: submit.body.sessionId,
      question: 'How should I design my SQL database schema?',
    });

    expect(ask.status).toBe(200);
    expect(String(ask.body.answer).toLowerCase()).toContain('only supports onboarding');
  });
});
