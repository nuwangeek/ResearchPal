export type ActivityType =
  | 'papers_found'
  | 'topic_created'
  | 'topic_paused'
  | 'document_uploaded'
  | 'document_processed'
  | 'curation_error';

export interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  metadata?: Record<string, string>;
  createdAt: string;
}
