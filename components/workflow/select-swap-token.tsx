import { ArrowBigRight } from "lucide-react";
import TokenSelectAndInput, { ITokenNumDesc } from "./token-select-and-input";
import { useTokenSwap } from "@/lib/hooks/use-tokenswap";
import { useContext, useEffect, useMemo } from "react";
import { TokenContext } from "@/lib/providers/token-provider";

export default function SelectSwapToken({
  token0,
  token1,
  setToken0,
  setToken1,
  routing,
  setSpender
}: {
  routing: string;
  token0: ITokenNumDesc;
  token1: ITokenNumDesc;
  setToken0: (_t: ITokenNumDesc | any) => void;
  setToken1: (_t: ITokenNumDesc | any) => void;
  setSpender: (_t: string) => void
}) {
  const { tokens } = useContext(TokenContext);

  useEffect(() => {
    const tokenAddress = (tokens || []).map((item) => item.token_address);
    if (tokens?.[0] && !tokenAddress.includes(token0?.token?.token_address || '')) {
      setToken0((prev: ITokenNumDesc) => ({
        ...prev,
        token: tokens?.[0],
      }));
    }
  }, [tokens, token0.token, setToken0]);

  useEffect(() => {
    const tokenAddress = (tokens || []).map((item) => item.token_address);
    if (tokens?.[1] && !tokenAddress.includes(token1?.token?.token_address || '')) {
      setToken1((prev: ITokenNumDesc) => ({
        ...prev,
        token: tokens?.[1],
      }));
    }
  }, [tokens, token1.token, setToken1]);

  const {
    handleToken0Change,
    handleToken0NumChange,
    handleToken1Change,
    handleToken1NumChange,
  } = useTokenSwap(routing, token0, token1, setToken0, setToken1, setSpender);

  return (
    <div className="mt-3 flex items-center justify-between px-3">
      <TokenSelectAndInput
        label="Token0"
        tokens={tokens}
        token={token0.token}
        tokenNum={token0.num}
        handleTokenChange={handleToken0Change}
        handleTokenNumChange={handleToken0NumChange}
      />
      <ArrowBigRight
        className="mx-1 mt-1 h-5 w-5 text-[#7d8998]"
        style={{
          transform: "translateY(10px)",
        }}
      />
      <TokenSelectAndInput
        label="Token1"
        tokens={tokens}
        token={token1.token}
        tokenNum={token1.num}
        handleTokenChange={handleToken1Change}
        handleTokenNumChange={handleToken1NumChange}
      />
    </div>
  );
}
