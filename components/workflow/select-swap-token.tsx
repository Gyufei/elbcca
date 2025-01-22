import { ArrowBigRight } from "lucide-react";
import TokenSelectAndInput from "./token-select-and-input";
import { SwapTokenType, useTokenSwap } from "@/lib/hooks/use-tokenswap";
import { IToken } from "@/lib/types/token";


export default function SelectSwapToken({
  routing,
  options = [],
  value,
  onChange = () => {}
}: {
  options: IToken[];
  value: SwapTokenType;
  onChange: (v: Partial<SwapTokenType>) => void;
  routing: string;
}) {
  const {
    token0,
    token1,
    token0Num,
    token1Num
  } = value;

  const onTokenChange = (v: Partial<SwapTokenType>) => {
    onChange({
      ...v
    })
  }

  const {
    handleTokenChange,
    handleTokenNumChange,
  } = useTokenSwap(routing, value, onTokenChange);

  return (
    <div className="mt-3 flex items-center justify-between px-3">
      <TokenSelectAndInput
        label="Token0"
        tokens={options}
        token={token0}
        tokenNum={token0Num}
        handleTokenChange={(v) => handleTokenChange(v, 'token0')}
        handleTokenNumChange={(n) => handleTokenNumChange(n, 'token0')}
      />
      <ArrowBigRight
        className="mx-1 mt-1 h-5 w-5 text-[#7d8998]"
        style={{
          transform: "translateY(10px)",
        }}
      />
      <TokenSelectAndInput
        label="Token1"
        tokens={options}
        token={token1}
        tokenNum={token1Num}
        handleTokenChange={(v) => handleTokenChange(v, 'token1')}
        handleTokenNumChange={(n) => handleTokenNumChange(n, 'token1')}
      />
    </div>
  );
}
