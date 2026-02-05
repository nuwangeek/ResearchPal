import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FileText } from 'lucide-react';

interface SourceCitationProps {
  paperTitle: string;
  section?: string;
  onClick?: () => void;
}

export function SourceCitation({ paperTitle, section, onClick }: SourceCitationProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className="cursor-pointer hover:bg-muted"
            onClick={onClick}
          >
            <FileText className="mr-1 h-3 w-3" />
            {section || 'Source'}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{paperTitle}</p>
          {section && <p className="text-xs text-muted-foreground">{section}</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
