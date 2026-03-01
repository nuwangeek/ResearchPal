# Frontend MVP Spec — ResearchPal

This spec defines the frontend-only MVP for ResearchPal. It is the single source of truth for all UI implementation work. Backend details are intentionally excluded — only the API contract the frontend expects is specified.

---

## 1. MVP Scope

Two curation modes + chat:

1. **Automated Topic Curation** — Configure research topics with keywords, enable cron scraping, set frequency and time window. System curates arXiv papers automatically.
2. **Manual Document Upload** — Upload PDFs, images, Word docs. System processes and indexes them.
3. **Chat with Papers** — Text and voice-based chat with selected curated papers or uploaded documents. Streamed responses with source citations.

**Explicitly out of MVP scope:** Authentication, user accounts, multi-tenancy, pagination UI, collaborative features, paper annotations, export/sharing, onboarding wizard.

---

## 2. Routes

```
Route              Purpose                                    Layout
/                  Landing page (existing)                    Public (no sidebar)
/app               Dashboard — stats, recent papers, feed     App shell (sidebar)
/app/topics        Topic configuration + cron setup           App shell
/app/documents     File upload + document management          App shell
/app/chat          Chat with papers (text + voice)            App shell
```

**App Router file structure:**

```
app/
  layout.tsx              # Root layout (fonts, metadata)
  page.tsx                # Landing page (existing, minor updates)
  globals.css             # Design tokens (expanded)
  app/
    layout.tsx            # App shell (sidebar + top bar)
    page.tsx              # Dashboard
    topics/
      page.tsx            # Topic configuration
    documents/
      page.tsx            # Document upload & management
    chat/
      page.tsx            # Chat interface
```

---

## 3. User Flows

### Flow 1: First-Time Setup
1. Landing page (`/`) → click "Get Started"
2. Dashboard (`/app`) shows empty state: "No topics configured yet"
3. CTA navigates to `/app/topics`
4. User creates first topic → enables cron → saves
5. Dashboard now shows "Curation in progress" status

### Flow 2: Configure a Topic
1. `/app/topics` → see topic list (or empty state)
2. Click "Add Topic" → slide-over panel opens
3. Fill: name, keywords (tag input), frequency, time window, optional end date
4. Toggle "Enable automated curation"
5. Save → topic appears in list with status badge (active/paused/completed/error)
6. Edit, pause/resume, or delete from topic card actions

### Flow 3: Upload Documents
1. `/app/documents` → drag-and-drop zone always visible at top
2. Drop files or click "Browse files"
3. Upload progress shown per file (progress bar)
4. After processing: document card shows "Ready" status
5. Click "Chat" on any document card → navigates to `/app/chat` with document pre-selected

### Flow 4: Chat with Papers
1. `/app/chat` → left panel: paper/document selector (checkboxes, grouped by source)
2. Select one or more papers/documents
3. Type message or click microphone for voice input
4. Response streams in via SSE with source citations inline
5. Message history persists within the session

---

## 4. Component Architecture

Components organized by feature following established `components/landing/` pattern.

### 4.1 Shared UI Primitives (`components/ui/`)

Generated via shadcn/ui. These are copy-paste components (not a package dependency), built on Radix UI for accessibility, styled with Tailwind.

| Component | Purpose |
|-----------|---------|
| `button.tsx` | Primary, secondary, ghost, destructive variants |
| `input.tsx` | Text input with label and error state |
| `badge.tsx` | Status indicators (active, paused, processing, ready) |
| `card.tsx` | Container with optional header/footer |
| `dialog.tsx` | Modal for confirmations (e.g., delete topic) |
| `sheet.tsx` | Slide-over panel (topic create/edit form) |
| `dropdown-menu.tsx` | Context menus (topic card actions) |
| `switch.tsx` | Toggle (enable/disable cron) |
| `select.tsx` | Dropdown (frequency, time window) |
| `textarea.tsx` | Multi-line input (chat) |
| `separator.tsx` | Visual divider |
| `skeleton.tsx` | Loading placeholder |
| `tooltip.tsx` | Hover tooltips |

Toast notifications via `sonner` (recommended by shadcn/ui, simpler than Radix toast).

### 4.2 Layout (`components/layout/`)

```typescript
// app-shell.tsx — Authenticated app wrapper
// Fixed left sidebar (240px, collapses to 64px on mobile < 768px)
// Top bar with page title and action slot
// Main content area (max-width: 1200px, centered)
interface AppShellProps {
  children: React.ReactNode;
}

// sidebar.tsx — Navigation sidebar
// Links: Dashboard, Topics, Documents, Chat (each with icon + label)
// Active state highlight, collapse toggle at bottom
interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

// top-bar.tsx — Horizontal bar above content
// Dynamic page title, optional action buttons on right
interface TopBarProps {
  title: string;
  actions?: React.ReactNode;
}
```

### 4.3 Landing (`components/landing/`) — Existing

Minimal changes to existing components:
- `navbar.tsx` — Update "Get Started" href from `"#"` to `"/app"`
- `hero.tsx` — Update "Get Started" href from `"#"` to `"/app"`
- `feature-card.tsx` — No changes
- `footer.tsx` — No changes
- `icons.tsx` — No changes (app icons use lucide-react instead)

### 4.4 Dashboard (`components/dashboard/`)

```typescript
// stats-grid.tsx — Row of 4 stat cards
// Displays: total topics, active topics, total papers, total documents
// Layout: 4 columns desktop, 2x2 mobile
interface StatsGridProps {
  totalTopics: number;
  activeTopics: number;
  totalPapers: number;
  totalDocuments: number;
}

// recent-papers.tsx — Compact list of 5-10 recently curated papers
// Each row: title + source topic + date, clickable (opens chat)
interface RecentPapersProps {
  papers: Paper[];
}

// activity-feed.tsx — Timeline of system events
// Events: papers found, jobs completed, uploads processed, errors
interface ActivityFeedProps {
  activities: Activity[];
}

// empty-state.tsx — Reusable empty state with CTA
// Centered icon + title + description + action button
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}
```

### 4.5 Topics (`components/topics/`)

```typescript
// topic-list.tsx — Card grid of configured topics
// 2 columns desktop, 1 column mobile
// Each card: name, keyword badges, frequency, status badge, last run time
// Three-dot menu on each card: Edit, Pause/Resume, Delete
interface TopicListProps {
  topics: Topic[];
  onEdit: (topicId: string) => void;
  onToggle: (topicId: string, enabled: boolean) => void;
  onDelete: (topicId: string) => void;
}

// topic-form.tsx — Create/edit form rendered inside a Sheet
// Fields: name (required), keywords (tag input), frequency (select),
//   time window (select), start date, end date (optional with checkbox),
//   enable cron (switch)
interface TopicFormProps {
  topic?: Topic;              // undefined = create, defined = edit
  onSubmit: (data: TopicFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

// keyword-input.tsx — Tag-style input for multiple keywords
// Type keyword → press Enter to add → click X on tag to remove
interface KeywordInputProps {
  keywords: string[];
  onChange: (keywords: string[]) => void;
  placeholder?: string;
}

// topic-status-badge.tsx — Colored status indicator
interface TopicStatusBadgeProps {
  status: TopicStatus;        // 'active' | 'paused' | 'completed' | 'error'
}
```

### 4.6 Documents (`components/documents/`)

```typescript
// upload-zone.tsx — Drag-and-drop file upload area
// States: idle (dashed border), drag-over (highlighted), uploading
// Click opens file picker, supports multi-file
interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  isUploading: boolean;
  acceptedTypes: string[];    // MIME types
}

// upload-progress.tsx — Upload progress per file
// Shows: filename + progress bar + percentage
// States: uploading → processing → ready | error
interface UploadProgressProps {
  uploads: UploadState[];
}

// document-grid.tsx — Card grid of uploaded documents
// Each card: file type icon, title, type badge, date, status, actions
interface DocumentGridProps {
  documents: Document[];
  onDelete: (documentId: string) => void;
  onChat: (documentId: string) => void;
}

// document-card.tsx — Individual document card
interface DocumentCardProps {
  document: Document;
  onDelete: () => void;
  onChat: () => void;
}
```

### 4.7 Chat (`components/chat/`)

```typescript
// paper-selector.tsx — Left panel for selecting papers/docs to chat about
// Grouped: "Curated Papers" and "Uploaded Documents"
// Each item: checkbox + title + source indicator
// Search/filter input at top
interface PaperSelectorProps {
  papers: Paper[];
  documents: Document[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

// message-list.tsx — Scrollable message thread
// User messages right-aligned (accent bg), assistant left-aligned (muted bg)
// Auto-scrolls to bottom on new messages
interface MessageListProps {
  messages: ChatMessage[];
  isStreaming: boolean;
}

// message-bubble.tsx — Individual message
// Shows: avatar/icon, content, timestamp
// Assistant messages include inline source citation chips
interface MessageBubbleProps {
  message: ChatMessage;
  isStreaming?: boolean;
}

// chat-input.tsx — Text + voice input area
// Auto-growing textarea, mic button (left), send button (right)
// Enter to send, Shift+Enter for newline
// States: idle, recording (pulsing red mic), sending (disabled)
interface ChatInputProps {
  onSend: (content: string) => void;
  isDisabled: boolean;
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

// voice-indicator.tsx — Visual feedback during recording
// Pulsing animation + duration counter
interface VoiceIndicatorProps {
  isRecording: boolean;
  duration: number;
}

// source-citation.tsx — Inline reference chip in assistant messages
interface SourceCitationProps {
  paperTitle: string;
  section?: string;
  onClick?: () => void;
}
```

---

## 5. State Management — Zustand

### Stores (`stores/`)

```typescript
// stores/topic-store.ts
interface TopicStore {
  topics: Topic[];
  isLoading: boolean;
  error: string | null;
  fetchTopics: () => Promise<void>;
  createTopic: (data: TopicFormData) => Promise<void>;
  updateTopic: (id: string, data: Partial<TopicFormData>) => Promise<void>;
  deleteTopic: (id: string) => Promise<void>;
  toggleTopic: (id: string, enabled: boolean) => Promise<void>;
}

// stores/document-store.ts
interface DocumentStore {
  documents: Document[];
  uploads: UploadState[];
  isLoading: boolean;
  error: string | null;
  fetchDocuments: () => Promise<void>;
  uploadFiles: (files: File[]) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  updateUploadProgress: (fileId: string, progress: number) => void;
}

// stores/paper-store.ts
interface PaperStore {
  papers: Paper[];
  isLoading: boolean;
  error: string | null;
  fetchPapers: (filters?: PaperFilters) => Promise<void>;
  fetchRecentPapers: (limit: number) => Promise<void>;
}

// stores/chat-store.ts
interface ChatStore {
  messages: ChatMessage[];
  selectedPaperIds: string[];
  isStreaming: boolean;
  isRecording: boolean;
  error: string | null;
  setSelectedPapers: (ids: string[]) => void;
  sendMessage: (content: string) => Promise<void>;
  appendStreamChunk: (chunk: string) => void;
  clearChat: () => void;
  setRecording: (isRecording: boolean) => void;
}
```

### Hooks (`hooks/`)

| Hook | Store | Extra Logic |
|------|-------|-------------|
| `use-topics.ts` | topic-store | Form helpers, loading/error wrapping |
| `use-documents.ts` | document-store | File validation, upload coordination |
| `use-papers.ts` | paper-store | Filtering, pagination helpers |
| `use-chat.ts` | chat-store | SSE connection lifecycle, message formatting |
| `use-voice-input.ts` | — | Web Speech API, MediaRecorder, browser compat check |
| `use-file-upload.ts` | — | Drag-and-drop handlers, file type/size validation |

---

## 6. Domain Types (`types/`)

```typescript
// types/paper.ts
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


// types/topic.ts
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


// types/document.ts
export type DocumentType = 'pdf' | 'image' | 'word' | 'other';
export type DocumentStatus = 'uploading' | 'processing' | 'ready' | 'error';

export interface Document {
  id: string;
  title: string;                   // Extracted or filename
  fileName: string;
  fileType: DocumentType;
  fileSizeBytes: number;
  status: DocumentStatus;
  errorMessage?: string;
  uploadedAt: string;
  processedAt?: string;
}

export interface UploadState {
  fileId: string;                  // Client-generated temp ID
  fileName: string;
  progress: number;                // 0-100
  status: 'uploading' | 'processing' | 'ready' | 'error';
  errorMessage?: string;
}


// types/chat.ts
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


// types/activity.ts
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


// types/api.ts
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
```

---

## 7. API Contract (Frontend Perspective)

All endpoints prefixed with `/api/v1`. Frontend communicates via `lib/api-client.ts`.

### API Client (`lib/api-client.ts`)

Thin fetch wrapper with: base URL from `NEXT_PUBLIC_API_URL`, JSON serialization, error handling, typed responses, file upload (multipart/form-data with progress), SSE streaming (returns AbortController for cancellation).

### Endpoints

```
TOPICS
  GET    /api/v1/topics                  → PaginatedResponse<Topic>
  POST   /api/v1/topics                  → ApiResponse<Topic>
  GET    /api/v1/topics/:id              → ApiResponse<Topic>
  PUT    /api/v1/topics/:id              → ApiResponse<Topic>
  DELETE /api/v1/topics/:id              → ApiResponse<null>
  PATCH  /api/v1/topics/:id/toggle       → ApiResponse<Topic>
         Body: { enabled: boolean }

PAPERS
  GET    /api/v1/papers                  → PaginatedResponse<Paper>
         Query: topicId, search, dateFrom, dateTo, sortBy, page, limit
  GET    /api/v1/papers/:id              → ApiResponse<Paper>

DOCUMENTS
  GET    /api/v1/documents               → PaginatedResponse<Document>
  POST   /api/v1/documents/upload        → ApiResponse<Document>
         Body: FormData (field: "file")
  GET    /api/v1/documents/:id           → ApiResponse<Document>
  DELETE /api/v1/documents/:id           → ApiResponse<null>

DASHBOARD
  GET    /api/v1/dashboard/stats         → ApiResponse<DashboardStats>
  GET    /api/v1/dashboard/activity      → ApiResponse<Activity[]>  (?limit=10)
  GET    /api/v1/dashboard/recent-papers → ApiResponse<Paper[]>    (?limit=5)

CHAT (SSE)
  POST   /api/v1/chat/stream             → SSE event stream
         Body: { paperIds: string[], documentIds: string[], message: string }
         Events:
           { type: "chunk", content: "..." }
           { type: "citation", paperId, paperTitle, section }
           { type: "done" }
           { type: "error", message: "..." }
```

---

## 8. Design System

### shadcn/ui

Use shadcn/ui for all UI primitives. Rationale:
- Generates component source files into `components/ui/` (not a runtime dependency)
- Radix UI underneath for production-grade accessibility
- Tailwind-styled, consistent with existing approach
- Full control over generated code

### Color Tokens (expanded `globals.css`)

```css
:root {
  /* Existing */
  --background: #ffffff;
  --foreground: #171717;
  --accent: #2563eb;

  /* Surface */
  --card: #ffffff;
  --card-foreground: #171717;
  --muted: #f5f5f5;
  --muted-foreground: #737373;
  --border: #e5e5e5;
  --input: #e5e5e5;
  --ring: #2563eb;

  /* Semantic */
  --primary: #2563eb;
  --primary-foreground: #ffffff;
  --secondary: #f5f5f5;
  --secondary-foreground: #171717;
  --destructive: #ef4444;
  --destructive-foreground: #ffffff;
  --success: #22c55e;
  --warning: #f59e0b;

  /* Sidebar */
  --sidebar: #fafafa;
  --sidebar-foreground: #171717;
  --sidebar-border: #e5e5e5;
  --sidebar-active: #2563eb;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
    --accent: #60a5fa;

    --card: #171717;
    --card-foreground: #ededed;
    --muted: #262626;
    --muted-foreground: #a3a3a3;
    --border: #262626;
    --input: #262626;
    --ring: #60a5fa;

    --primary: #60a5fa;
    --primary-foreground: #0a0a0a;
    --secondary: #262626;
    --secondary-foreground: #ededed;
    --destructive: #dc2626;
    --destructive-foreground: #ededed;
    --success: #16a34a;
    --warning: #d97706;

    --sidebar: #0f0f0f;
    --sidebar-foreground: #ededed;
    --sidebar-border: #262626;
    --sidebar-active: #60a5fa;
  }
}
```

### Layout Tokens

| Token | Value |
|-------|-------|
| Sidebar width (expanded) | 240px |
| Sidebar width (collapsed) | 64px |
| Top bar height | 56px |
| Content max-width | 1200px |
| Card border-radius | 12px (`rounded-xl`) |
| Card padding | 24px (`p-6`) |
| Section gap | 24px (`gap-6`) |
| Page padding | 24px desktop, 16px mobile |

### Typography

Keep Geist Sans + Geist Mono. Use Tailwind's built-in scale:

| Class | Size | Usage |
|-------|------|-------|
| `text-xs` | 12px | Metadata, timestamps |
| `text-sm` | 14px | Form labels, secondary text |
| `text-base` | 16px | Body text, chat messages |
| `text-lg` | 18px | Card titles, section headers |
| `text-xl` | 20px | Page titles |
| `text-2xl` | 24px | Dashboard stat numbers |

### Icons

Use `lucide-react` — tree-shakeable, consistent style, 1000+ icons. Replace the hand-crafted SVGs in `components/landing/icons.tsx` only in app pages; landing page keeps its existing icons.

---

## 9. Dependencies

### Add (Production)

| Package | Purpose |
|---------|---------|
| `zustand` | State management |
| `lucide-react` | Icons |
| `clsx` | Conditional class joining (shadcn/ui) |
| `tailwind-merge` | Tailwind class deduplication (shadcn/ui) |
| `class-variance-authority` | Component variants (shadcn/ui) |
| `sonner` | Toast notifications |
| Radix UI packages | Installed per-component by shadcn/ui CLI |

### Not Adding (and why)

| Package | Reason |
|---------|--------|
| `@tanstack/react-query` | Zustand async actions suffice for MVP |
| `react-hook-form` | Only one non-trivial form; controlled state is simpler |
| `framer-motion` | CSS transitions suffice for MVP |
| `next-auth` | No auth in MVP |
| `axios` | Native fetch is sufficient |

---

## 10. Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| No authentication | Simplifies MVP; add NextAuth.js post-MVP |
| SSE over WebSocket for chat | Unidirectional streaming fits request-response pattern; simpler than WebSocket |
| Web Speech API for voice | Browser-native, no external service; show compat notice if unavailable |
| Landing page separate from app shell | `/` is public marketing; `/app` is the product; evolve independently |
| No pagination UI | API supports it, but MVP loads all data; add when usage data warrants it |
| shadcn/ui over custom components | Accessible primitives without vendor lock-in; generated code is fully owned |
| Zustand over Context API | No provider nesting, works with server components, minimal boilerplate |

---

## 11. Implementation Phases

### Phase 1: Foundation
- Initialize shadcn/ui (`npx shadcn@latest init`)
- Generate UI primitives: button, input, card, badge, switch, select, sheet, dialog, separator, skeleton, tooltip
- Expand `globals.css` with full color token palette
- Install `zustand`, `lucide-react`, `sonner`
- Create all files in `types/`
- Create `lib/utils.ts` (cn helper) and `lib/api-client.ts`

### Phase 2: App Shell
- Create `app/app/layout.tsx` with AppShell
- Build `components/layout/sidebar.tsx`, `top-bar.tsx`
- Responsive sidebar collapse
- Update landing page "Get Started" links to `/app`

### Phase 3: Dashboard
- Create `app/app/page.tsx`
- Build `components/dashboard/` (stats-grid, recent-papers, activity-feed, empty-state)
- Create `stores/paper-store.ts` + `hooks/use-papers.ts`
- Wire with mock data

### Phase 4: Topic Configuration
- Create `app/app/topics/page.tsx`
- Build `components/topics/` (topic-list, topic-form, keyword-input, topic-status-badge)
- Create `stores/topic-store.ts` + `hooks/use-topics.ts`
- Wire CRUD operations with mock data

### Phase 5: Document Upload
- Create `app/app/documents/page.tsx`
- Build `components/documents/` (upload-zone, upload-progress, document-grid, document-card)
- Create `stores/document-store.ts` + `hooks/use-documents.ts` + `hooks/use-file-upload.ts`
- Implement drag-and-drop with progress tracking

### Phase 6: Chat Interface
- Create `app/app/chat/page.tsx`
- Build `components/chat/` (paper-selector, message-list, message-bubble, chat-input, voice-indicator, source-citation)
- Create `stores/chat-store.ts` + `hooks/use-chat.ts` + `hooks/use-voice-input.ts`
- Implement SSE streaming in api-client
- Implement Web Speech API for voice

### Phase 7: Polish
- Loading states (skeleton screens) on all pages
- Error states + toast notifications
- Empty states for all lists
- Responsive audit across breakpoints
- Dark mode consistency check

---

## 12. Final Directory Structure

```
apps/gui/src/research_pal/
  app/
    layout.tsx                    # Root (fonts, metadata)
    page.tsx                      # Landing page
    globals.css                   # Design tokens
    app/
      layout.tsx                  # App shell (sidebar + top bar)
      page.tsx                    # Dashboard
      topics/
        page.tsx
      documents/
        page.tsx
      chat/
        page.tsx
  components/
    ui/                           # shadcn/ui primitives
      button.tsx
      input.tsx
      badge.tsx
      card.tsx
      dialog.tsx
      sheet.tsx
      dropdown-menu.tsx
      switch.tsx
      select.tsx
      textarea.tsx
      separator.tsx
      skeleton.tsx
      tooltip.tsx
    layout/
      app-shell.tsx
      sidebar.tsx
      top-bar.tsx
    landing/                      # Existing
      navbar.tsx
      hero.tsx
      footer.tsx
      feature-card.tsx
      icons.tsx
    dashboard/
      stats-grid.tsx
      recent-papers.tsx
      activity-feed.tsx
      empty-state.tsx
    topics/
      topic-list.tsx
      topic-form.tsx
      keyword-input.tsx
      topic-status-badge.tsx
    documents/
      upload-zone.tsx
      upload-progress.tsx
      document-grid.tsx
      document-card.tsx
    chat/
      paper-selector.tsx
      message-list.tsx
      message-bubble.tsx
      chat-input.tsx
      voice-indicator.tsx
      source-citation.tsx
  hooks/
    use-topics.ts
    use-documents.ts
    use-papers.ts
    use-chat.ts
    use-voice-input.ts
    use-file-upload.ts
  stores/
    topic-store.ts
    document-store.ts
    paper-store.ts
    chat-store.ts
  types/
    paper.ts
    topic.ts
    document.ts
    chat.ts
    activity.ts
    api.ts
  lib/
    utils.ts                      # cn() helper
    api-client.ts                 # Fetch wrapper + SSE
  public/
  package.json
  tsconfig.json
  next.config.ts
  eslint.config.mjs
  postcss.config.mjs
```
