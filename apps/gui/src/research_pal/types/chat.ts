export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  citations?: SourceCitation[];
  createdAt: string;
}

export interface SourceCitation {
  paperId: string;
  paperTitle: string;
  section?: string;
  relevanceSnippet?: string;
}
