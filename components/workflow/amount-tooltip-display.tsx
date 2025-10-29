import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function AmountTooltipDisplay({ amount }: { amount: string }) {
  const isLong = amount && amount.length > 8;
  const amountFmt = isLong ? amount?.slice(0, 8) + "..." : amount;
  return isLong ? (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="TruncateSingleLine">{amountFmt}</div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex items-center">
            <p className="text-sm text-content-color">{amount}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <div>{amount}</div>
  );
}
