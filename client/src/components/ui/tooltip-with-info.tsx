import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface InfoTooltipProps {
  term: string;
  explanation: string;
  children?: React.ReactNode;
}

export function InfoTooltip({ term, explanation, children }: InfoTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger className="inline-flex items-center gap-1 cursor-help">
          {children || term}
          <Info className="h-4 w-4 text-muted-foreground" />
        </TooltipTrigger>
        <TooltipContent 
          className="max-w-[300px] text-sm"
          side="top"
          sideOffset={5}
        >
          <p>{explanation}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
