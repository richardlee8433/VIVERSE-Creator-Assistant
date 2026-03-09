import data from '@/data/creator-paths.json';
import { classifyCreatorProfile } from '@/lib/classifier/scorer';
import { resolveRecommendedDocs } from '@/lib/docs/resolver';
import { generateGuide } from '@/lib/guide/generator';
import { getSessionStore } from '@/lib/session/store';
import { routePath } from '@/lib/router/path-router';
import { onboardingSubmitSchema } from '@/lib/validation/onboarding';
import { askSchema } from '@/lib/validation/ask';

const profileLabels = Object.fromEntries(data.profiles.map((p) => [p.id, p.label])) as Record<string, string>;
const pathLabels = Object.fromEntries(data.paths.map((p) => [p.id, p.label])) as Record<string, string>;

export async function submitOnboarding(payload: unknown) {
  const parsed = onboardingSubmitSchema.safeParse(payload);
  if (!parsed.success) return { status: 400, body: { error: 'Invalid onboarding payload' } };

  const { answers } = parsed.data;
  const classification = classifyCreatorProfile(answers);
  const recommendedPath = routePath(classification.profile, answers);
  const recommendedGuides = resolveRecommendedDocs(recommendedPath);
  const generatedGuide = await generateGuide({
    answers,
    profile: classification.profile,
    path: recommendedPath,
    docs: recommendedGuides,
  });

  const session = await getSessionStore().create({
    answers,
    creatorProfile: classification.profile,
    recommendedPath,
    confidence: classification.confidence,
    generatedGuide,
    recommendedGuides,
  });

  return {
    status: 200,
    body: {
      sessionId: session.sessionId,
      creatorProfile: session.creatorProfile,
      recommendedPath: session.recommendedPath,
      confidence: session.confidence,
      resultUrl: `/result/${session.sessionId}`,
      recommendationSnapshot: {
        sessionId: session.sessionId,
        creatorProfile: { id: session.creatorProfile, label: profileLabels[session.creatorProfile] },
        recommendedPath: { id: session.recommendedPath, label: pathLabels[session.recommendedPath] },
        guide: session.generatedGuide,
        recommendedGuides: session.recommendedGuides.map((g) => ({
          id: g.id,
          title: g.title,
          url: g.url,
          reason: g.reason,
          sourceUrl: g.sourceUrl,
        })),
      },
    },
  };
}

export async function getRecommendation(sessionId: string) {
  const session = await getSessionStore().get(sessionId);
  if (!session) return { status: 404, body: { error: 'Session not found' } };

  return {
    status: 200,
    body: {
      sessionId: session.sessionId,
      creatorProfile: { id: session.creatorProfile, label: profileLabels[session.creatorProfile] },
      recommendedPath: { id: session.recommendedPath, label: pathLabels[session.recommendedPath] },
      guide: session.generatedGuide,
      recommendedGuides: session.recommendedGuides.map((g) => ({
        id: g.id,
        title: g.title,
        url: g.url,
        reason: g.reason,
        sourceUrl: g.sourceUrl,
      })),
    },
  };
}

const OUT_OF_SCOPE_HINTS = ['database', 'deploy backend', 'auth', 'payment', 'sql', 'vector'];

export async function askOnboardingQuestion(payload: unknown) {
  const parsed = askSchema.safeParse(payload);
  if (!parsed.success) return { status: 400, body: { error: 'Invalid ask payload' } };

  const session = await getSessionStore().get(parsed.data.sessionId);
  if (!session) return { status: 404, body: { error: 'Session not found' } };

  const lower = parsed.data.question.toLowerCase();
  const outOfScope = OUT_OF_SCOPE_HINTS.some((hint) => lower.includes(hint));
  if (outOfScope) {
    return {
      status: 200,
      body: {
        answer:
          'This MVP only supports onboarding and getting-started guidance. Please continue with your recommended path and official docs first.',
        recommendedGuides: session.recommendedGuides.slice(0, 2).map((g) => ({ id: g.id, title: g.title, url: g.url, sourceUrl: g.sourceUrl })),
      },
    };
  }

  return {
    status: 200,
    body: {
      answer: `Given your ${profileLabels[session.creatorProfile]} profile, stay on ${pathLabels[session.recommendedPath]} and complete setup before deciding on alternative tooling.`,
      recommendedGuides: session.recommendedGuides.slice(0, 3).map((g) => ({ id: g.id, title: g.title, url: g.url, sourceUrl: g.sourceUrl })),
    },
  };
}
