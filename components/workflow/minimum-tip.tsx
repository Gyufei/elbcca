

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";



export function MinimumTip({
  text,
}: {
  text: string;
}) {
  return (
    <div className="absolute right-2 w-[60%] top-[20px] select-none">
      {String(text).length > 5 ? (
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="TruncateSingleLine text-[12px] text-[#707070]">
                {text}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="flex items-center">
                <p className="text-sm text-content-color">{text}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <div className="TruncateSingleLine text-[12px] text-[#707070]">
          {text}
        </div>
      )}
    </div>
  );
}
