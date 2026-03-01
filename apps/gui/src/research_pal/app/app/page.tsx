'use client';

import { TopBar } from '@/components/layout/top-bar';
import { StatsGrid } from '@/components/dashboard/stats-grid';
import { RecentPapers } from '@/components/dashboard/recent-papers';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { EmptyState } from '@/components/dashboard/empty-state';
import { useRecentPapers } from '@/hooks/use-papers';
import { Activity } from '@/types/activity';
import { FileText } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Mock activity data
const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'papers_found',
    description: '5 new papers found for "Machine Learning"',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    type: 'topic_created',
    description: 'Created new topic: "Natural Language Processing"',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '3',
    type: 'document_uploaded',
    description: 'Uploaded "research_paper.pdf"',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

export default function DashboardPage() {
  const { papers, isLoading } = useRecentPapers(5);

  // Mock stats (in real app, fetch from API)
  const hasTopics = true;
  const stats = {
    totalTopics: 3,
    activeTopics: 2,
    totalPapers: 12,
    totalDocuments: 5,
  };

  return (
    <>
      <TopBar title="Dashboard" />
      <div className="mt-6 space-y-6">
        {/* Show empty state if no topics */}
        {!hasTopics ? (
          <EmptyState
            icon={<FileText className="h-12 w-12" />}
            title="No topics configured yet"
            description="Get started by creating your first research topic. The system will automatically curate relevant papers for you."
            actionLabel="Create Topic"
            actionHref="/app/topics"
          />
        ) : (
          <>
            {/* Stats Grid */}
            <StatsGrid {...stats} />

            {/* Recent Papers and Activity Feed */}
            <div className="grid gap-6 lg:grid-cols-2">
              {isLoading ? (
                <Skeleton className="h-[300px]" />
              ) : (
                <RecentPapers papers={papers} />
              )}
              <ActivityFeed activities={mockActivities} />
            </div>
          </>
        )}
      </div>
    </>
  );
}
