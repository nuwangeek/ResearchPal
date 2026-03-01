'use client';

import { useState } from 'react';
import { Paper } from '@/types/paper';
import { Document } from '@/types/document';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Search, FileText, Upload } from 'lucide-react';

interface PaperSelectorProps {
  papers: Paper[];
  documents: Document[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

export function PaperSelector({
  papers,
  documents,
  selectedIds,
  onSelectionChange,
}: PaperSelectorProps) {
  const [search, setSearch] = useState('');

  const filteredPapers = papers.filter((paper) =>
    paper.title.toLowerCase().includes(search.toLowerCase())
  );

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  return (
    <Card className="flex h-full flex-col">
      {/* Search */}
      <div className="border-b p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search papers and documents..."
            className="pl-9"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Curated Papers */}
        {filteredPapers.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-4 w-4" />
              <span>Curated Papers ({filteredPapers.length})</span>
            </div>

            <div className="space-y-2">
              {filteredPapers.map((paper) => (
                <label
                  key={paper.id}
                  className="flex items-start gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted transition-colors"
                >
                  <Checkbox
                    checked={selectedIds.includes(paper.id)}
                    onCheckedChange={() => toggleSelection(paper.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-2">{paper.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                      {paper.authors.join(', ')}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Separator */}
        {filteredPapers.length > 0 && filteredDocuments.length > 0 && (
          <Separator />
        )}

        {/* Uploaded Documents */}
        {filteredDocuments.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Upload className="h-4 w-4" />
              <span>Uploaded Documents ({filteredDocuments.length})</span>
            </div>

            <div className="space-y-2">
              {filteredDocuments.map((doc) => (
                <label
                  key={doc.id}
                  className="flex items-start gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted transition-colors"
                >
                  <Checkbox
                    checked={selectedIds.includes(doc.id)}
                    onCheckedChange={() => toggleSelection(doc.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-2">{doc.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {doc.fileName}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {filteredPapers.length === 0 && filteredDocuments.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-muted-foreground">
              {search ? 'No results found' : 'No papers or documents available'}
            </p>
          </div>
        )}
      </div>

      {/* Selected count */}
      {selectedIds.length > 0 && (
        <div className="border-t p-4">
          <p className="text-sm text-muted-foreground">
            {selectedIds.length} item{selectedIds.length !== 1 ? 's' : ''} selected
          </p>
        </div>
      )}
    </Card>
  );
}
