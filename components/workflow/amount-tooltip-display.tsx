import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export default function AmountTooltipDisplay({
  amount,
  textClx,
}: {
  amount: string;
  textClx?: string;
}) {
  const isLong = amount && amount.length > 8;
  const amountFmt = isLong ? amount?.slice(0, 8) + "..." : amount;

  return isLong ? (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("TruncateSingleLine", textClx)}>{amountFmt}</div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex items-center">
            <p className={cn("text-sm text-content-color")}>{amount}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <div className={cn(textClx)}>{amount}</div>
  );
}
