import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Paper } from '@/types/paper';
import { FileText } from 'lucide-react';

interface RecentPapersProps {
  papers: Paper[];
}

export function RecentPapers({ papers }: RecentPapersProps) {
  if (papers.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Recent Papers</h3>
        <p className="text-sm text-muted-foreground">No papers curated yet.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-semibold">Recent Papers</h3>
      <div className="space-y-3">
        {papers.map((paper) => (
          <Link
            key={paper.id}
            href={`/app/chat?paperId=${paper.id}`}
            className="block rounded-lg border border-border p-3 transition-colors hover:bg-muted"
          >
            <div className="flex items-start gap-3">
              <FileText className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-medium line-clamp-1">{paper.title}</h4>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{new Date(paper.curatedAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span className="line-clamp-1">{paper.authors.join(', ')}</span>
                </div>
                {paper.categories && paper.categories.length > 0 && (
                  <div className="mt-2 flex gap-1">
                    {paper.categories.slice(0, 2).map((category) => (
                      <Badge key={category} variant="secondary" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}
