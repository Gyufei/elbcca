import { StatusEnum } from "@/lib/types/task";
import { useMemo } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

export default function SwapHistoryItemMemo({
  status,
  memo,
}: {
  status: StatusEnum;
  memo: string;
}) {
  const showMemo = useMemo(
    () =>
      status === StatusEnum["pre-queue"] ||
      status === StatusEnum.queue ||
      status === StatusEnum.failed,
    [status],
  );

  if (!showMemo) return null;

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle className="ml-1 h-4 w-4" />
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex w-[300px] items-center break-all">
            <p className="text-sm text-content-color">{memo}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
