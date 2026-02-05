export interface Paper {
  id: string;
  arxivId: string;
  title: string;
  authors: string[];
  abstract: string;
  publishedDate: string;           // ISO 8601
  categories: string[];            // arXiv categories (e.g., "cs.AI")
  pdfUrl: string;
  sourceTopicId: string;
  curatedAt: string;
  relevanceScore?: number;         // 0-1
}

export interface PaperFilters {
  topicId?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'relevance' | 'date';
  page?: number;
  limit?: number;
}
