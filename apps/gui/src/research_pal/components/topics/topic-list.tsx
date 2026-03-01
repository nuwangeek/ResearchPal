'use client';

import { Topic } from '@/types/topic';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TopicStatusBadge } from './topic-status-badge';
import { MoreVertical, Edit, Pause, Play, Trash2 } from 'lucide-react';

interface TopicListProps {
  topics: Topic[];
  onEdit: (topicId: string) => void;
  onToggle: (topicId: string, enabled: boolean) => void;
  onDelete: (topicId: string) => void;
}

export function TopicList({ topics, onEdit, onToggle, onDelete }: TopicListProps) {
  if (topics.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No topics configured yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {topics.map((topic) => (
        <Card key={topic.id} className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold">{topic.name}</h3>
                <div className="flex items-center gap-2">
                  <TopicStatusBadge status={topic.status} />
                  <span className="text-xs text-muted-foreground">
                    {topic.paperCount} papers
                  </span>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(topic.id)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onToggle(topic.id, !topic.enabled)}>
                    {topic.enabled ? (
                      <>
                        <Pause className="mr-2 h-4 w-4" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Resume
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete(topic.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Keywords */}
            <div className="flex flex-wrap gap-1">
              {topic.keywords.map((keyword) => (
                <Badge key={keyword} variant="outline" className="text-xs">
                  {keyword}
                </Badge>
              ))}
            </div>

            {/* Meta */}
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Frequency:</span>
                <span className="font-medium text-foreground">
                  {topic.frequency.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Time window:</span>
                <span className="font-medium text-foreground">
                  {topic.timeWindow === 'custom'
                    ? `${topic.customDays} days`
                    : topic.timeWindow}
                </span>
              </div>
              {topic.lastRunAt && (
                <div className="flex justify-between">
                  <span>Last run:</span>
                  <span className="font-medium text-foreground">
                    {new Date(topic.lastRunAt).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
