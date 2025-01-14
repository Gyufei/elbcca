

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { useMemo, useState } from "react";
import { ITokenNumDesc } from "./token-select-and-input";



export function MinimumTip({
  token0,
  token1
}: {
  token0: ITokenNumDesc
  token1: ITokenNumDesc
}) {
  const [transType, setTransType] = useState(false);

  const tokenAdvanceInfo = useMemo(() => {
    if (!token0.token || !token1.token) return;
    if (!token0.num || !token1.num) return;
    if (transType === false) {
      const tokenRadio = (Number(token0.num) / Number(token1.num))
      return {
        symbolName: [token0.token.token_symbol, token1.token.token_symbol],
        tokenRadio
      };
    } else {
      const tokenRadio = (Number(token1.num) / Number(token0.num))
      return {
        symbolName: [token1.token.token_symbol, token0.token.token_symbol],
        tokenRadio
      };
    }
    
  }, [token0, token1, transType]);

  function handleChangeTrans() {
    setTransType(!transType)
  }

  if (!tokenAdvanceInfo) return null;
  return (
    <div className="h-[24px]">
      <div className="absolute right-0 top-[44px]  max-w-[80%] h-[24px] flex flex-row-reverse align-items text-[12px] text-[#707070]">
        <Image src="/icons/minimum.svg" width={12} height={12} alt="arrow" className="h-[12px] w-[12px] cursor-pointer mx-2 mt-[2px]" onClick={handleChangeTrans} />
        {tokenAdvanceInfo.symbolName[0] || ''}
        <div className="select-none max-w-[40%]">
          {String(tokenAdvanceInfo.tokenRadio).length > 5 ? (
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="TruncateSingleLine">
                    {tokenAdvanceInfo.tokenRadio}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="flex items-center">
                    <p className="text-sm text-content-color">{tokenAdvanceInfo.tokenRadio}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <div className="TruncateSingleLine text-[12px] text-[#707070]">
              {tokenAdvanceInfo.tokenRadio}
            </div>
          )}
        </div>
        <div>1{tokenAdvanceInfo.symbolName[1] || ''}=</div>
      </div>
  </div>

  );
}
