# VIVERSE Creator Onboarding Assistant (Backend MVP)

Backend MVP for classifying creators from onboarding answers, routing them to a recommended VIVERSE Create path, resolving docs, generating a personalized quick-start guide, and supporting limited onboarding follow-up Q&A.

## What this MVP does

- Validates 6 onboarding answers with strict enums (Zod)
- Classifies creator profile via deterministic rule-based scoring
- Maps profile to recommended path with simple overrides
- Resolves 3–5 onboarding docs by metadata + priority (no embeddings)
- Generates personalized guide with OpenAI JSON output + fallback template
- Stores onboarding sessions in a file-backed JSON store
- Accepts basic analytics events
- Exposes backend APIs via Next.js Route Handlers

## Folder structure

- `app/api/*` route handlers
- `lib/classifier/*` profile rules + scorer
- `lib/router/*` profile → path router
- `lib/docs/*` docs registry + resolver
- `lib/guide/*` LLM output parsing + fallback
- `lib/llm/*` OpenAI client + prompts
- `lib/session/*` types + file session store
- `lib/validation/*` payload schemas
- `lib/analytics/*` analytics validation + persistence
- `data/*` seeded questions, profile/path mappings, docs registry
- `tests/*` classifier, router, docs, guide, and API flow tests

## Environment variables

- `OPENAI_API_KEY` (required for live LLM generation; fallback works without it)
- `OPENAI_MODEL` (optional, default: `gpt-4o-mini`)
- `SESSION_STORE_PATH` (optional, default: `./data/sessions.json`)
- `ANALYTICS_STORE_PATH` (optional, default: `./data/analytics.log`)

## Run locally

```bash
npm install
npm test
```

(If integrating with a full Next.js app, route handlers are already under `app/api`.)

## Test

```bash
npm test
```

## Intentionally out of scope

- vector DB / embeddings / full RAG
- auth/login
- admin dashboard / CMS
- multi-language
- full debugging or code-generation assistant
- generalized chatbot behavior

## Placeholder doc URLs

All docs links are in `data/docs-registry.json` and use `https://docs.viverse.com/...` placeholders that can be replaced with official final URLs later.
