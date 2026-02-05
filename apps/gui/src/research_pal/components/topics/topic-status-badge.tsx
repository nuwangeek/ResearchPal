import { Badge } from '@/components/ui/badge';
import { TopicStatus } from '@/types/topic';

interface TopicStatusBadgeProps {
  status: TopicStatus;
}

const statusConfig: Record<TopicStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  active: {
    label: 'Active',
    variant: 'default',
  },
  paused: {
    label: 'Paused',
    variant: 'secondary',
  },
  completed: {
    label: 'Completed',
    variant: 'outline',
  },
  error: {
    label: 'Error',
    variant: 'destructive',
  },
};

export function TopicStatusBadge({ status }: TopicStatusBadgeProps) {
  const config = statusConfig[status];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
