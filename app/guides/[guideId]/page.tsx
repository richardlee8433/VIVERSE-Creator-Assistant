import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { loadDocsRegistry } from '@/lib/docs/registry';

type GuidePageProps = {
  params: Promise<{ guideId: string }>;
};

function stageLabel(stage: string): string {
  if (stage === 'intro') return 'Introduction';
  if (stage === 'setup') return 'Setup';
  if (stage === 'first_build') return 'First build';
  if (stage === 'publish') return 'Publish';
  return 'Guide';
}

function stageChecklist(stage: string): string[] {
  if (stage === 'intro') return ['Understand the goal of this path', 'Review required tools', 'Confirm the expected output'];
  if (stage === 'setup') return ['Install required tools', 'Prepare project/workspace settings', 'Run a basic validation check'];
  if (stage === 'first_build') return ['Create a minimal working scene', 'Test interaction loop locally', 'Iterate with one improvement pass'];
  if (stage === 'publish') return ['Run pre-publish checklist', 'Validate build/output', 'Publish and share your result'];
  return ['Review this guide summary', 'Apply one step at a time', 'Move to the next recommended guide'];
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { guideId } = await params;
  const doc = loadDocsRegistry().find((entry) => entry.id === guideId);
  if (!doc) notFound();

  const stage = doc.taskStages[0] ?? 'misc';
  const checklist = stageChecklist(stage);

  return (
    <main className="min-h-screen bg-background">
      <div className="container py-10 max-w-3xl">
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-3">
            <Badge variant="outline">{stageLabel(stage)}</Badge>
            <Button variant="ghost" asChild>
              <Link href="/onboarding">Back to onboarding</Link>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{doc.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{doc.summary}</p>
              <div>
                <h2 className="font-semibold mb-2">Quick guide checklist</h2>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  {checklist.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="pt-2">
                <Button asChild>
                  <a href={doc.sourceUrl ?? doc.url} target="_blank" rel="noopener noreferrer">
                    Open official documentation
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
