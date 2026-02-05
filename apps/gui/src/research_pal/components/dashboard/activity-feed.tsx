import { Card } from '@/components/ui/card';
import { Activity } from '@/types/activity';
import {
  CheckCircle,
  FileText,
  Pause,
  Upload,
  CheckSquare,
  AlertCircle
} from 'lucide-react';

interface ActivityFeedProps {
  activities: Activity[];
}

function getActivityIcon(type: Activity['type']) {
  switch (type) {
    case 'papers_found':
      return FileText;
    case 'topic_created':
      return CheckCircle;
    case 'topic_paused':
      return Pause;
    case 'document_uploaded':
      return Upload;
    case 'document_processed':
      return CheckSquare;
    case 'curation_error':
      return AlertCircle;
    default:
      return FileText;
  }
}

function getActivityColor(type: Activity['type']) {
  switch (type) {
    case 'papers_found':
      return 'text-accent';
    case 'topic_created':
      return 'text-success';
    case 'topic_paused':
      return 'text-muted-foreground';
    case 'document_uploaded':
      return 'text-primary';
    case 'document_processed':
      return 'text-success';
    case 'curation_error':
      return 'text-destructive';
    default:
      return 'text-muted-foreground';
  }
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Activity</h3>
        <p className="text-sm text-muted-foreground">No activity yet.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-semibold">Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = getActivityIcon(activity.type);
          const color = getActivityColor(activity.type);

          return (
            <div key={activity.id} className="flex gap-3">
              <Icon className={`mt-0.5 h-5 w-5 flex-shrink-0 ${color}`} />
              <div className="min-w-0 flex-1">
                <p className="text-sm">{activity.description}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(activity.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
