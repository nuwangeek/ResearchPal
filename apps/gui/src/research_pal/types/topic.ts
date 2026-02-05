export type TopicStatus = 'active' | 'paused' | 'completed' | 'error';
export type ScrapingFrequency = 'daily' | 'every_3_days' | 'weekly';
export type TimeWindow = '7d' | '14d' | '30d' | 'custom';

export interface Topic {
  id: string;
  name: string;
  keywords: string[];
  frequency: ScrapingFrequency;
  timeWindow: TimeWindow;
  customDays?: number;             // Only when timeWindow === 'custom'
  startDate: string;
  endDate?: string;                // undefined = runs indefinitely
  enabled: boolean;
  status: TopicStatus;
  lastRunAt?: string;
  paperCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TopicFormData {
  name: string;
  keywords: string[];
  frequency: ScrapingFrequency;
  timeWindow: TimeWindow;
  customDays?: number;
  startDate: string;
  endDate?: string;
  enabled: boolean;
}
