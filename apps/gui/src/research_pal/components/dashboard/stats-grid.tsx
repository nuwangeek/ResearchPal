import { Card } from '@/components/ui/card';
import { FileText, FileCheck, Upload, Clock } from 'lucide-react';

interface StatsGridProps {
  totalTopics: number;
  activeTopics: number;
  totalPapers: number;
  totalDocuments: number;
}

const stats = (props: StatsGridProps) => [
  {
    name: 'Total Topics',
    value: props.totalTopics,
    icon: FileText,
    color: 'text-primary',
  },
  {
    name: 'Active Topics',
    value: props.activeTopics,
    icon: Clock,
    color: 'text-success',
  },
  {
    name: 'Curated Papers',
    value: props.totalPapers,
    icon: FileCheck,
    color: 'text-accent',
  },
  {
    name: 'Documents',
    value: props.totalDocuments,
    icon: Upload,
    color: 'text-warning',
  },
];

export function StatsGrid(props: StatsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats(props).map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.name} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                <p className="mt-2 text-2xl font-bold">{stat.value}</p>
              </div>
              <Icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </Card>
        );
      })}
    </div>
  );
}
