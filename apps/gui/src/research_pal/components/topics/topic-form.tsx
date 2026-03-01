'use client';

import { useState, useEffect } from 'react';
import { Topic, TopicFormData, ScrapingFrequency, TimeWindow } from '@/types/topic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { KeywordInput } from './keyword-input';
import { Separator } from '@/components/ui/separator';

interface TopicFormProps {
  topic?: Topic;
  onSubmit: (data: TopicFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const frequencyOptions: { value: ScrapingFrequency; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'every_3_days', label: 'Every 3 Days' },
  { value: 'weekly', label: 'Weekly' },
];

const timeWindowOptions: { value: TimeWindow; label: string }[] = [
  { value: '7d', label: 'Last 7 days' },
  { value: '14d', label: 'Last 14 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: 'custom', label: 'Custom' },
];

export function TopicForm({ topic, onSubmit, onCancel, isSubmitting }: TopicFormProps) {
  const [formData, setFormData] = useState<TopicFormData>({
    name: topic?.name || '',
    keywords: topic?.keywords || [],
    frequency: topic?.frequency || 'daily',
    timeWindow: topic?.timeWindow || '7d',
    customDays: topic?.customDays,
    startDate: topic?.startDate || new Date().toISOString().split('T')[0],
    endDate: topic?.endDate?.split('T')[0],
    enabled: topic?.enabled ?? true,
  });

  const [hasEndDate, setHasEndDate] = useState(!!topic?.endDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      endDate: hasEndDate ? formData.endDate : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Topic Name <span className="text-destructive">*</span>
        </label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Machine Learning"
          required
        />
      </div>

      {/* Keywords */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Keywords <span className="text-destructive">*</span>
        </label>
        <KeywordInput
          keywords={formData.keywords}
          onChange={(keywords) => setFormData({ ...formData, keywords })}
          placeholder="Type keyword and press Enter"
        />
        <p className="text-xs text-muted-foreground">
          Add keywords to search for in paper titles and abstracts
        </p>
      </div>

      {/* Frequency */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Scraping Frequency</label>
        <Select
          value={formData.frequency}
          onValueChange={(value) =>
            setFormData({ ...formData, frequency: value as ScrapingFrequency })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {frequencyOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Time Window */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Time Window</label>
        <Select
          value={formData.timeWindow}
          onValueChange={(value) =>
            setFormData({ ...formData, timeWindow: value as TimeWindow })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {timeWindowOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formData.timeWindow === 'custom' && (
          <Input
            type="number"
            value={formData.customDays || ''}
            onChange={(e) =>
              setFormData({ ...formData, customDays: parseInt(e.target.value) })
            }
            placeholder="Number of days"
            min={1}
            required
          />
        )}
      </div>

      <Separator />

      {/* Start Date */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Start Date</label>
        <Input
          type="date"
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          required
        />
      </div>

      {/* End Date (Optional) */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Switch
            checked={hasEndDate}
            onCheckedChange={setHasEndDate}
            id="has-end-date"
          />
          <label htmlFor="has-end-date" className="text-sm font-medium">
            Set end date (optional)
          </label>
        </div>
        {hasEndDate && (
          <Input
            type="date"
            value={formData.endDate || ''}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            min={formData.startDate}
          />
        )}
        <p className="text-xs text-muted-foreground">
          If not set, curation will run indefinitely
        </p>
      </div>

      <Separator />

      {/* Enable Cron */}
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div>
          <p className="text-sm font-medium">Enable Automated Curation</p>
          <p className="text-xs text-muted-foreground">
            Automatically curate papers based on schedule
          </p>
        </div>
        <Switch
          checked={formData.enabled}
          onCheckedChange={(enabled) => setFormData({ ...formData, enabled })}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || formData.keywords.length === 0}>
          {isSubmitting ? 'Saving...' : topic ? 'Update Topic' : 'Create Topic'}
        </Button>
      </div>
    </form>
  );
}
